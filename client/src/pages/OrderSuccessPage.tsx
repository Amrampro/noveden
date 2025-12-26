import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../config/theme";
import { Button } from "../components/Button";
import { ordersService } from "../services/ordersService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function OrderSuccessPage() {
  const q = useQuery();
  const navigate = useNavigate();
  const orderId = q.get("order");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await ordersService.getMyOrder(orderId);
        setData(res);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (!orderId) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ ...theme.body.large }}>Commande introuvable.</p>
          <Button variant="primary" onClick={() => navigate("/shop")}>Retour boutique</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.colors.background.primary }}>
      <section style={{ backgroundColor: theme.colors.background.sage, padding: `${theme.spacing["3xl"]} ${theme.spacing.lg}` }}>
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <h1 style={{ ...theme.heading.h1 }}>Merci 🎉</h1>
          <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
            Votre paiement a été pris en compte. Nous préparons votre commande.
          </p>
        </div>
      </section>

      <section style={{ padding: `${theme.spacing["2xl"]} ${theme.spacing.lg}` }}>
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div
            style={{
              maxWidth: 860,
              margin: "0 auto",
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.light}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing["2xl"],
              boxShadow: theme.shadow.card,
            }}
          >
            {loading ? (
              <div style={{ ...theme.body.base, color: theme.colors.text.secondary }}>Chargement…</div>
            ) : !data?.order ? (
              <div style={{ ...theme.body.base, color: theme.colors.text.secondary }}>
                Impossible de charger les détails de la commande.
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing.md }}>
                  <div>
                    <div style={{ ...theme.body.small, color: theme.colors.text.light }}>Commande</div>
                    <div style={{ ...theme.heading.h4 }}>{data.order.id}</div>
                  </div>
                  <div>
                    <div style={{ ...theme.body.small, color: theme.colors.text.light }}>Statut</div>
                    <div style={{ ...theme.heading.h4, color: theme.colors.primary.main }}>
                      {data.order.status}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: theme.spacing.xl, borderTop: `1px solid ${theme.colors.border.light}`, paddingTop: theme.spacing.lg }}>
                  <div style={{ ...theme.heading.h5, marginBottom: theme.spacing.sm }}>Suivi</div>
                  {data.order.shipping_tracking_number ? (
                    <div style={{ ...theme.body.base }}>
                      Numéro: <b>{data.order.shipping_tracking_number}</b><br />
                      {data.order.shipping_tracking_url ? (
                        <a href={data.order.shipping_tracking_url} target="_blank" rel="noreferrer">
                          Suivre le colis
                        </a>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ ...theme.body.base, color: theme.colors.text.secondary }}>
                      Le suivi sera disponible dès que l’expédition sera créée.
                    </div>
                  )}
                </div>
              </>
            )}

            <div style={{ marginTop: theme.spacing.xl, display: "flex", gap: theme.spacing.md, justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="primary" onClick={() => navigate("/shop")}>
                Continuer mes achats
              </Button>
              <Button variant="outline" onClick={() => navigate("/account")}>
                Mon compte
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
