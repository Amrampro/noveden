// client/src/pages/FidelitePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../config/theme";
import { Button } from "../components/Button";
import HERO_IMG from "../assets/img/fidelity.jpg";

export function FidelitePage() {
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
          <div style={{ padding: `${theme.spacing["2xl"]} 0`, textAlign: "center" }}>
            <h1 style={{ ...theme.heading.h1, margin: 0 }}>Fidélité</h1>
            <p
              style={{
                ...theme.body.base,
                marginTop: theme.spacing.md,
                color: theme.colors.text.secondary,
              }}
            >
              Découvrez comment économiser et gagner grâce à notre programme de fidélité !
            </p>
          </div>
        </div>
      </div>

      <div style={container()}>
        {/* PROGRAMME AMBASSADEUR */}
        <section style={{ paddingTop: theme.spacing["2xl"] }}>
          <div style={sectionHeader()}>
            <h2 style={{ ...theme.heading.h3, margin: 0 }}>
              Programme Ambassadeur
            </h2>
            <p
              style={{
                ...theme.body.base,
                marginTop: theme.spacing.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Devenez ambassadeur et gagnez des commissions sur chaque parrainage.
            </p>
          </div>

          <div style={card()}>
            <ol
              style={{
                marginTop: theme.spacing.lg,
                paddingLeft: 18,
                color: theme.colors.text.primary,
                lineHeight: 1.7,
              }}
            >
              <li>Créez votre compte sur notre plateforme.</li>
              <li>Rendez-vous dans <b>Mon compte</b>.</li>
              <li>
                Vous verrez l’option <b>Ambassadeur</b> pour activer votre compte
                et obtenir votre code de parrainage.
              </li>
            </ol>

            <div
              style={{
                marginTop: theme.spacing.xl,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="primary" onClick={() => navigate("/account")}>
                Accéder à mon compte
              </Button>
            </div>
          </div>
        </section>

        {/* IMAGE CENTRÉE */}
        <section style={{ padding: `${theme.spacing["2xl"]} 0` }}>
          <div
            style={{
              borderRadius: theme.borderRadius.xl,
              overflow: "hidden",
              border: `1px solid ${theme.colors.border.light}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={HERO_IMG}
              alt="Programme de fidélité"
              style={{
                width: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>
        </section>

        {/* REDUCTIONS FIDELITE */}
        <section style={{ paddingBottom: theme.spacing["2xl"] }}>
          <div style={sectionHeader()}>
            <h2 style={{ ...theme.heading.h3, margin: 0 }}>
              Réductions Fidélité
            </h2>
            <p
              style={{
                ...theme.body.base,
                marginTop: theme.spacing.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Plus vous commandez, plus vous êtes récompensé.
            </p>
          </div>

          <div style={grid2()}>
            <DiscountCard
              title="Après votre 1ère commande"
              highlight="-10%"
              desc="Bénéficiez de 10% de réduction sur votre prochaine commande."
              icon="🎁"
            />
            <DiscountCard
              title="À partir de votre 6ème commande"
              highlight="15%"
              desc="Obtenez 15% de réduction à compter de votre sixième commande."
              icon="🏷️"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------------------- UI Helpers -------------------- */

function DiscountCard(props: {
  title: string;
  highlight: string;
  desc: string;
  icon?: string;
}) {
  return (
    <div style={card()}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              ...theme.body.small,
              color: theme.colors.text.secondary,
            }}
          >
            {props.title}
          </div>
          <div
            style={{
              marginTop: theme.spacing.sm,
              fontSize: 34,
              fontWeight: 800,
              color: theme.colors.primary.main,
            }}
          >
            {props.highlight}
          </div>
        </div>

        <div style={{ fontSize: 28 }}>{props.icon}</div>
      </div>

      <div
        style={{
          height: 1,
          backgroundColor: theme.colors.border.light,
          margin: `${theme.spacing.lg} 0`,
        }}
      />

      <p style={{ ...theme.body.base, margin: 0 }}>{props.desc}</p>
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