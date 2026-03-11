// client/src/pages/AmbassadorsPage.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { theme } from "../config/theme";
import { Button } from "../components/Button";

export function AmbassadorsPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background.primary,
      }}
    >
      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${theme.colors.border.light}` }}>
        <div style={container()}>
          <div
            style={{
              padding: `${theme.spacing["2xl"]} 0`,
              textAlign: "center",
            }}
          >
            <h1 style={{ ...theme.heading.h1, margin: 0 }}>
              Programme Ambassadeur
            </h1>
            <p
              style={{
                ...theme.body.base,
                marginTop: theme.spacing.md,
                color: theme.colors.text.secondary,
                maxWidth: 780,
                marginInline: "auto",
              }}
            >
              Rejoignez notre programme exclusif et gagnez des commissions grâce
              à votre code de parrainage.
            </p>
          </div>
        </div>
      </div>

      <div style={container()}>
        {/* IMPORTANT NOTICE */}
        <section style={{ paddingTop: theme.spacing["2xl"] }}>
          <div style={alertCard()}>
            <div style={alertTitle()}>
              ⚠️ Important avant de devenir ambassadeur
            </div>

            <p
              style={{
                ...theme.body.base,
                marginTop: theme.spacing.md,
                marginBottom: 0,
              }}
            >
              Pour devenir ambassadeur, il faut{" "}
              <span style={dangerText()}>OBLIGATOIREMENT</span> :
            </p>

            <ol
              style={{
                marginTop: theme.spacing.md,
                paddingLeft: 18,
                color: theme.colors.text.primary,
                lineHeight: 1.8,
              }}
            >
              <li>
                <span style={dangerText()}>
                  1- créer un compte sur la plateforme
                </span>{" "}
                puis,
              </li>
              <li>
                <span style={dangerText()}>2- se connecter</span> et ensuite,
              </li>
              <li>
                <span style={dangerText()}>3- accéder </span>à <b>Mon compte</b>{" "}
                pour activer son espace <b>Ambassadeur</b>
              </li>
            </ol>

            <div
              style={{
                marginTop: theme.spacing.lg,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.background.primary,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <p
                style={{
                  ...theme.body.base,
                  margin: 0,
                  color: theme.colors.text.primary,
                  lineHeight: 1.7,
                }}
              >
                <span style={dangerText()}>
                  - Vous n’avez pas encore de compte ?
                </span>{" "}
                - Vous devez d’abord créer un compte sur la plateforme.{" "}
                <i>
                  <Link
                    style={{ textDecoration: "underline", color: "blue" }}
                    to="/signup"
                  >
                    Pour créer un compte, cliquer ici
                  </Link>
                </i>
              </p>

              <p
                style={{
                  ...theme.body.base,
                  marginTop: theme.spacing.sm,
                  marginBottom: 0,
                  color: theme.colors.text.primary,
                  lineHeight: 1.7,
                }}
              >
                <span style={dangerText()}>- Vous avez déjà un compte ?</span>{" "}
                Vous devez simplement vous connecter avant d’accéder au compte
                ambassadeur.{" "}
                <i>
                  <Link
                    style={{ textDecoration: "underline", color: "blue" }}
                    to="/auth"
                  >
                    Pour vous connecter à la plateforme, cliquer ici
                  </Link>
                </i>
              </p>
              <p
                style={{
                  ...theme.body.base,
                  marginTop: theme.spacing.sm,
                  marginBottom: 0,
                  color: theme.colors.text.primary,
                  lineHeight: 1.7,
                }}
              >
                <span style={dangerText()}>
                  - Vous êtes déjà connecté à la plateforme ?
                </span>{" "}
                Accédez tout simplement au paramètres du compte ambassadeur.{" "}
                <i>
                  <Link
                    style={{ textDecoration: "underline", color: "blue" }}
                    to="/ambassador/account"
                  >
                    Pour accéder au compte ambassadeur, cliquer ici
                  </Link>
                </i>
              </p>
            </div>

            <div
              style={{
                marginTop: theme.spacing.xl,
                display: "flex",
                justifyContent: "center",
                gap: theme.spacing.md,
                flexWrap: "wrap",
              }}
            >
              <Button variant="primary" onClick={() => navigate("/signup")}>
                Créer un compte
              </Button>
              <Button variant="outline" onClick={() => navigate("/auth")}>
                Se connecter
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/ambassador/account")}
              >
                Accéder au compte ambassadeur
              </Button>
            </div>
          </div>
        </section>

        {/* GETTING STARTED */}
        <section style={{ paddingTop: theme.spacing["2xl"] }}>
          <div style={sectionHeader()}>
            <h2 style={{ ...theme.heading.h3, margin: 0 }}>
              Comment devenir ambassadeur
            </h2>
          </div>

          <div style={card()}>
            <ol
              style={{
                marginTop: theme.spacing.lg,
                paddingLeft: 18,
                color: theme.colors.text.primary,
                lineHeight: 1.8,
              }}
            >
              <li>
                Créez votre compte sur notre plateforme si vous n’en avez pas
                encore un.
              </li>
              <li>Connectez-vous à votre compte.</li>
              <li>
                Rendez-vous dans <b>Mon compte</b>.
              </li>
              <li>
                Vous verrez l’option <b>Ambassadeur</b> pour activer votre
                compte et obtenir votre code de parrainage.
              </li>
            </ol>

            <div
              style={{
                marginTop: theme.spacing.xl,
                display: "flex",
                justifyContent: "center",
                gap: theme.spacing.md,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="secondary"
                onClick={() => navigate("/ambassador/account")}
              >
                Accéder au compte ambassadeur
              </Button>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section
          style={{
            paddingTop: theme.spacing["2xl"],
            paddingBottom: theme.spacing["2xl"],
          }}
        >
          <div style={sectionHeader()}>
            <h2 style={{ ...theme.heading.h3, margin: 0 }}>
              Avantages du programme
            </h2>
          </div>

          <div style={grid2()}>
            <BenefitCard
              title="Commissions"
              desc="Gagnez 5% des commissions sur chaque parrainage réussi."
              icon="💰"
            />
            <BenefitCard
              title="Code personnel"
              desc="Obtenez un code de parrainage unique à partager."
              icon="🔗"
            />
            <BenefitCard
              title="Support dédié"
              desc="Accédez à un support prioritaire pour vos questions."
              icon="🎧"
            />
            <BenefitCard
              title="Suivi en temps réel"
              desc="Consultez vos commissions et conversions en direct."
              icon="📊"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------------------- UI Helpers -------------------- */

function BenefitCard(props: { title: string; desc: string; icon?: string }) {
  return (
    <div style={card()}>
      <div style={{ fontSize: 32, marginBottom: theme.spacing.md }}>
        {props.icon}
      </div>
      <h3
        style={{
          ...theme.body.base,
          fontWeight: 700,
          margin: 0,
          marginBottom: theme.spacing.sm,
          color: theme.colors.text.primary,
        }}
      >
        {props.title}
      </h3>
      <p
        style={{
          ...theme.body.base,
          margin: 0,
          color: theme.colors.text.secondary,
          lineHeight: 1.7,
        }}
      >
        {props.desc}
      </p>
    </div>
  );
}

function container(): React.CSSProperties {
  return {
    maxWidth: theme.container.maxWidth,
    margin: "0 auto",
    padding: `0 ${theme.spacing["2xl"]}`,
  };
}

function sectionHeader(): React.CSSProperties {
  return {
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  };
}

function grid2(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: theme.spacing.xl,
  };
}

function card(): React.CSSProperties {
  return {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };
}

function alertCard(): React.CSSProperties {
  return {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.error.main}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };
}

function alertTitle(): React.CSSProperties {
  return {
    ...theme.heading.h4,
    margin: 0,
    color: theme.colors.error.main,
  };
}

function dangerText(): React.CSSProperties {
  return {
    color: theme.colors.error.main,
    fontWeight: 700,
  };
}
