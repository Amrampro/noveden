import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { theme } from "../config/theme";
import { Button } from "../components/Button";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { ordersService } from "../services/ordersService";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

type AddressForm = {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  postal_code: string;
  address1: string;
  address2: string;
};

function centsToEuro(cents: number) {
  return (cents / 100).toFixed(2);
}

/** Simple relay picker placeholder:
 * Replace this with Mondial Relay widget integration later.
 */
function RelayPointPicker({
  value,
  onChange,
}: {
  value: { id: string; name?: string; address?: string } | null;
  onChange: (v: { id: string; name?: string; address?: string } | null) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.sm,
      }}
    >
      <div style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
        Point Relais (Mondial Relay)
      </div>

      <div style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap" }}>
        <Button
          variant="outline"
          onClick={() =>
            onChange({
              id: "MR-12345",
              name: "Point Relais Exemple",
              address: "12 Rue Exemple, 1000 Bruxelles",
            })
          }
        >
          Choisir un point (demo)
        </Button>

        {value && (
          <Button variant="outline" onClick={() => onChange(null)}>
            Retirer
          </Button>
        )}
      </div>

      {value && (
        <div
          style={{
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
          }}
        >
          <div
            style={{
              ...theme.body.base,
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            {value.name || value.id}
          </div>
          <div
            style={{ ...theme.body.small, color: theme.colors.text.secondary }}
          >
            {value.address}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutInner({
  clientSecret,
  orderId,
  onPaid,
}: {
  clientSecret: string;
  orderId: string;
  onPaid: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [payBusy, setPayBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const handlePay = async () => {
    setPayError(null);
    if (!stripe || !elements) return;

    setPayBusy(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // After Stripe confirms, we redirect to success page
          return_url: `${
            window.location.origin
          }/order-success?order=${encodeURIComponent(orderId)}`,
        },
      });

      if (result.error) {
        setPayError(result.error.message || "Paiement refusé.");
      } else {
        // Usually Stripe redirects automatically to return_url.
        onPaid();
      }
    } finally {
      setPayBusy(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        border: `1px solid ${theme.colors.border.light}`,
      }}
    >
      <h3 style={{ ...theme.heading.h4, marginBottom: theme.spacing.lg }}>
        Paiement sécurisé
      </h3>

      <div style={{ marginBottom: theme.spacing.lg }}>
        <PaymentElement />
      </div>

      {payError && (
        <div
          style={{
            backgroundColor: theme.colors.error[50],
            border: `1px solid ${theme.colors.error.main}`,
            color: theme.colors.error.main,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.md,
          }}
        >
          {payError}
        </div>
      )}

      <Button
        variant="primary"
        size="large"
        fullWidth
        onClick={handlePay}
        disabled={!stripe || payBusy}
      >
        {payBusy ? "Paiement en cours..." : "Payer maintenant"}
      </Button>

      <p
        style={{
          ...theme.body.small,
          textAlign: "center",
          color: theme.colors.text.light,
          marginTop: theme.spacing.sm,
        }}
      >
        Paiement via Stripe • Vos informations sont chiffrées.
      </p>
    </div>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();

  const [step, setStep] = useState<"form" | "payment">("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [shippingMethod, setShippingMethod] = useState<
    "mondial_relay" | "home_delivery"
  >("mondial_relay");
  const [relayPoint, setRelayPoint] = useState<{
    id: string;
    name?: string;
    address?: string;
  } | null>(null);

  const [addr, setAddr] = useState<AddressForm>({
    full_name: "",
    email: user?.email || "",
    phone: "",
    country: "BE",
    city: "",
    postal_code: "",
    address1: "",
    address2: "",
  });

  const cartItemsPayload = useMemo(() => {
    return items.map((it) => ({
      product_id: it.product.id,
      quantity: it.quantity,
    }));
  }, [items]);

  // ✅ Guard
  if (!user) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ ...theme.body.large, marginBottom: theme.spacing.md }}>
            Vous devez être connecté pour commander.
          </p>
          <Button variant="primary" onClick={() => navigate("/auth")}>
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ ...theme.body.large, marginBottom: theme.spacing.md }}>
            Votre panier est vide.
          </p>
          <Button variant="primary" onClick={() => navigate("/shop")}>
            Aller à la boutique
          </Button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const required: (keyof AddressForm)[] = [
      "full_name",
      "email",
      "phone",
      "country",
      "city",
      "postal_code",
      "address1",
    ];
    for (const k of required) {
      if (!addr[k].trim()) return `Champ requis: ${k}`;
    }
    if (shippingMethod === "mondial_relay" && !relayPoint?.id) {
      return "Veuillez choisir un point Mondial Relay.";
    }
    return null;
  };

  const startCheckout = async () => {
    setError(null);
    const v = validateForm();
    if (v) return setError(v);

    setBusy(true);
    try {
      const payload = {
        cart_items: cartItemsPayload,
        coupon_code: null,
        shipping: {
          method: shippingMethod,
          address: { ...addr, address2: addr.address2 || null },
          relay_point: shippingMethod === "mondial_relay" ? relayPoint : null,
        },
      };

      //   const { stripe } = await ordersService.checkout(payload);
    //   const { order, client_secret } = await ordersService.checkout(payload);
    //   setClientSecret(client_secret);
    //   setOrderId(order.id);
    //   setStep("payment");

      // ✅ Redirect user to Stripe hosted payment page
      const { stripe } = await ordersService.checkout(payload);
      window.location.href = stripe.checkout_url;
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background.primary,
      }}
    >
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing["3xl"]} ${theme.spacing.lg}`,
          borderBottom: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <h1 style={{ ...theme.heading.h1 }}>Commande</h1>
          <p
            style={{ ...theme.body.large, color: theme.colors.text.secondary }}
          >
            Finalisez vos informations de livraison puis payez via Stripe.
          </p>
        </div>
      </section>

      <section
        style={{ padding: `${theme.spacing["2xl"]} ${theme.spacing.lg}` }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: theme.spacing["2xl"],
            }}
            className="checkout-grid"
          >
            {/* LEFT */}
            <div>
              {error && (
                <div
                  style={{
                    backgroundColor: theme.colors.error[50],
                    border: `1px solid ${theme.colors.error.main}`,
                    color: theme.colors.error.main,
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  {error}
                </div>
              )}

              {step === "form" ? (
                <div
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.xl,
                    border: `1px solid ${theme.colors.border.light}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.lg,
                  }}
                >
                  <h3 style={{ ...theme.heading.h4 }}>Adresse de livraison</h3>

                  <div style={{ display: "grid", gap: theme.spacing.md }}>
                    <input
                      value={addr.full_name}
                      onChange={(e) =>
                        setAddr((s) => ({ ...s, full_name: e.target.value }))
                      }
                      placeholder="Nom complet"
                      style={inputStyle()}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: theme.spacing.md,
                      }}
                    >
                      <input
                        value={addr.email}
                        onChange={(e) =>
                          setAddr((s) => ({ ...s, email: e.target.value }))
                        }
                        placeholder="Email"
                        style={inputStyle()}
                      />
                      <input
                        value={addr.phone}
                        onChange={(e) =>
                          setAddr((s) => ({ ...s, phone: e.target.value }))
                        }
                        placeholder="Téléphone"
                        style={inputStyle()}
                      />
                    </div>

                    <input
                      value={addr.address1}
                      onChange={(e) =>
                        setAddr((s) => ({ ...s, address1: e.target.value }))
                      }
                      placeholder="Adresse"
                      style={inputStyle()}
                    />
                    <input
                      value={addr.address2}
                      onChange={(e) =>
                        setAddr((s) => ({ ...s, address2: e.target.value }))
                      }
                      placeholder="Complément (optionnel)"
                      style={inputStyle()}
                    />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: theme.spacing.md,
                      }}
                    >
                      <input
                        value={addr.postal_code}
                        onChange={(e) =>
                          setAddr((s) => ({
                            ...s,
                            postal_code: e.target.value,
                          }))
                        }
                        placeholder="Code postal"
                        style={inputStyle()}
                      />
                      <input
                        value={addr.city}
                        onChange={(e) =>
                          setAddr((s) => ({ ...s, city: e.target.value }))
                        }
                        placeholder="Ville"
                        style={inputStyle()}
                      />
                      <input
                        value={addr.country}
                        onChange={(e) =>
                          setAddr((s) => ({
                            ...s,
                            country: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="Pays (BE)"
                        style={inputStyle()}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: theme.spacing.lg,
                      borderTop: `1px solid ${theme.colors.border.light}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: theme.spacing.md,
                    }}
                  >
                    <h3 style={{ ...theme.heading.h4 }}>Livraison</h3>

                    <div
                      style={{
                        display: "flex",
                        gap: theme.spacing.md,
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        variant={
                          shippingMethod === "mondial_relay"
                            ? "primary"
                            : "outline"
                        }
                        onClick={() => setShippingMethod("mondial_relay")}
                      >
                        Mondial Relay
                      </Button>
                      <Button
                        variant={
                          shippingMethod === "home_delivery"
                            ? "primary"
                            : "outline"
                        }
                        onClick={() => setShippingMethod("home_delivery")}
                      >
                        Livraison à domicile
                      </Button>
                    </div>

                    {shippingMethod === "mondial_relay" && (
                      <RelayPointPicker
                        value={relayPoint}
                        onChange={setRelayPoint}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: theme.spacing.md,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button variant="outline" onClick={() => navigate("/cart")}>
                      Retour au panier
                    </Button>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={startCheckout}
                      disabled={busy}
                    >
                      {busy ? "Préparation..." : "Continuer vers le paiement"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {clientSecret && orderId && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "stripe",
                        },
                      }}
                    >
                      <CheckoutInner
                        clientSecret={clientSecret}
                        orderId={orderId}
                        onPaid={() => {
                          // Usually Stripe redirects, but safe:
                          clearCart();
                        }}
                      />
                    </Elements>
                  )}
                </>
              )}
            </div>

            {/* RIGHT: SUMMARY */}
            <div>
              <div
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.xl,
                  border: `1px solid ${theme.colors.border.light}`,
                  position: "sticky",
                  top: 24,
                }}
              >
                <h3
                  style={{
                    ...theme.heading.h4,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  Résumé
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.sm,
                  }}
                >
                  {items.map((it) => (
                    <div
                      key={it.product.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: theme.spacing.md,
                      }}
                    >
                      <div
                        style={{
                          ...theme.body.small,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        {it.product.name} × {it.quantity}
                      </div>
                      <div style={{ ...theme.body.small }}>
                        {/* your cart total currently is in € numbers */}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: theme.spacing.lg,
                    paddingTop: theme.spacing.lg,
                    borderTop: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    <span
                      style={{
                        ...theme.body.base,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      Sous-total
                    </span>
                    <span
                      style={{
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {Number(getCartTotal()).toFixed(2)} €
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    <span
                      style={{
                        ...theme.body.base,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      Livraison
                    </span>
                    <span
                      style={{
                        ...theme.body.base,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      (calculée au paiement)
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: theme.spacing.md,
                    }}
                  >
                    <span style={{ ...theme.heading.h5 }}>Total</span>
                    <span
                      style={{
                        ...theme.heading.h4,
                        color: theme.colors.primary.main,
                      }}
                    >
                      {/* Stripe total computed server-side; will show in payment step */}
                      —
                    </span>
                  </div>

                  {step === "payment" && orderId && (
                    <div
                      style={{
                        marginTop: theme.spacing.md,
                        ...theme.body.small,
                        color: theme.colors.text.light,
                      }}
                    >
                      Commande: <b>{orderId}</b>
                      <br />
                      Total affiché dans Stripe.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @media (min-width: 1024px) {
              .checkout-grid {
                grid-template-columns: 2fr 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>
    </div>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border.main}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.body,
    backgroundColor: theme.colors.background.primary,
    outline: "none",
  };
}
