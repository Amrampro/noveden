// client/src/pages/AboutPage.tsx
import { Sparkles, Truck, Award, Heart, Leaf, ShieldCheck, Globe } from "lucide-react";
import { theme } from "../config/theme";
import { PageBanner } from "../components/PageBanner";

export function AboutPage() {
  const features = [
    {
      icon: Leaf,
      title: "Originelle",
      description: "Reconnecter la peau et les cheveux à leur beauté naturelle.",
    },
    {
      icon: Heart,
      title: "Pure",
      description: "Sans artifices. Sans danger.",
    },
    {
      icon: Globe,
      title: "Consciente",
      description: "Retour à l’essentiel.",
    },
    {
      icon: Sparkles,
      title: "Engagée",
      description: "Une beauté saine, transparente et responsable.",
    },
  ];

  return (
    <div>
      <PageBanner />

      {/* STORY */}
      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: theme.spacing["3xl"],
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.background.sage,
                borderRadius: theme.borderRadius["2xl"],
                border: `1px solid ${theme.colors.border.light}`,
                padding: theme.spacing["2xl"],
                boxShadow: theme.shadow.card,
              }}
            >
              <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.xl }}>
                Notre Histoire
              </h2>

              <div
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.body,
                }}
              >
                <p style={{ marginBottom: theme.spacing.lg }}>
                  L’aventure Novéden commence avec moi, <strong>Déborah</strong>, passionnée de nature — sa simplicité,
                  sa pureté, son authenticité et sa puissance. J’ai toujours su que pour révéler la beauté qui rayonne
                  de l’intérieur, il fallait puiser dans les merveilles de l’Éden.
                </p>

                <p style={{ marginBottom: theme.spacing.lg }}>
                  Tout est parti d’un besoin personnel : trouver des soins sains, efficaces, et sans danger pour ma peau
                  et mes cheveux. Lassée de déchiffrer des listes INCI interminables, trop souvent incompatibles avec
                  une routine simple et sereine, ma quête d’une beauté naturelle s’est révélée être un vrai défi.
                </p>

                <p style={{ marginBottom: 0 }}>
                  C’est ainsi qu’est née <strong>NOVÉDEN</strong> : reconnaître la beauté originelle de chaque femme,
                  respecter sa singularité, et proposer un retour vers une beauté naturelle, pure, saine — mais aussi
                  guidée par la science. Une démarche engagée et transparente, fidèle à la vision originelle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES / FEATURES */}
      <section
        style={{
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: theme.spacing["3xl"] }}>
            <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>
              Nos engagements
            </h2>
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.body,
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              Une routine simple, des actifs choisis avec exigence, et des standards de qualité élevés.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: theme.spacing.xl,
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.sage,
                  borderRadius: theme.borderRadius.lg,
                  textAlign: "center",
                  border: `1px solid ${theme.colors.border.light}`,
                  boxShadow: theme.shadow.card,
                }}
              >
                <feature.icon
                  size={48}
                  color={theme.colors.primary.main}
                  style={{ margin: `0 auto ${theme.spacing.md}` }}
                />
                <h3 style={{ ...theme.heading.h5, marginBottom: theme.spacing.sm }}>
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.body,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              ...theme.heading.h2,
              marginBottom: theme.spacing.xl,
              textAlign: "center",
            }}
          >
            Qui sommes-nous ?
          </h2>

          <div
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.body,
              backgroundColor: theme.colors.background.sage,
              borderRadius: theme.borderRadius["2xl"],
              border: `1px solid ${theme.colors.border.light}`,
              padding: theme.spacing["2xl"],
              boxShadow: theme.shadow.card,
            }}
          >
            <p style={{ marginBottom: theme.spacing.lg }}>
              <strong>NOVÉDEN</strong> est une marque de cosmétiques naturels dédiée à la beauté de tous les types de
              peau — y compris les peaux sensibles — et des cheveux texturés. Nos soins s’inspirent de la nature,
              de traditions comme l’Ayurveda et de la science dermo-cosmétique pour offrir des formules saines et
              efficaces.
            </p>

            <h3 style={{ ...theme.heading.h4, marginTop: theme.spacing["2xl"], marginBottom: theme.spacing.lg }}>
              Notre mission
            </h3>
            <p style={{ marginBottom: theme.spacing.lg }}>
              Créer des soins naturels, respectueux de chaque type de peau et de cheveux, pour révéler votre beauté
              réelle — sans masquer ni fragiliser. Des formules pensées pour sublimer, hydrater, nourrir et protéger au
              quotidien, en harmonie avec vous.
            </p>

            <h3 style={{ ...theme.heading.h4, marginTop: theme.spacing["2xl"], marginBottom: theme.spacing.lg }}>
              Notre vision
            </h3>
            <p style={{ marginBottom: theme.spacing.lg }}>
              Un retour à une beauté naturelle, pure, authentique et globale — comme un retour en Éden. Une marque
              inclusive qui célèbre chaque personne, et propose une alternative durable aux routines agressives.
            </p>

            <h3 style={{ ...theme.heading.h4, marginTop: theme.spacing["2xl"], marginBottom: theme.spacing.lg }}>
              Notre expertise
            </h3>
            <p style={{ marginBottom: 0 }}>
              Chaque formule s’appuie sur des actifs végétaux rigoureusement sélectionnés, des huiles et extraits
              naturels combinés avec exigence. Nous collaborons avec des laboratoires français et belges afin de
              garantir des standards élevés de qualité, de sécurité et d’efficacité.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
