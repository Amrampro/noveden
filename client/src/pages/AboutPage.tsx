import { Sparkles, Truck, Award, Heart } from 'lucide-react';
import { theme } from '../config/theme';

export function AboutPage() {
  return (
    <div>
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              ...theme.heading.h1,
              marginBottom: theme.spacing.lg,
              fontStyle: 'italic',
            }}
          >
            Des soins inspirés de la nature et perfectionnés par la science
          </h1>
        </div>
      </section>

      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: theme.spacing['3xl'],
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  ...theme.heading.h2,
                  marginBottom: theme.spacing.xl,
                }}
              >
                Notre Histoire
              </h2>
              <div
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.body,
                  marginBottom: theme.spacing.lg,
                }}
              >
                <p style={{ marginBottom: theme.spacing.lg }}>
                  L'aventure Novéden commence avec moi, <strong>Déborah</strong>, une passionnée de nature. J'aime sa
                  simplicité, sa pureté, son authenticité et sa puissance. J'ai toujours su que pour dévéler la beauté
                  qui rayonne de l'intérieur, il nous fallait puiser dans les merveilles de l'Éden.
                </p>
                <p style={{ marginBottom: theme.spacing.lg }}>
                  Tout a commencé par un besoin personnel, celui de trouver des soins sains, efficaces, et sans
                  danger pour ma peau et pour mes cheveux. Lasse de déchiffrer des listes INCI interminables et trop
                  souvent criblées et incommodés par l'industrie cosmétique. L'offre du marché ne répondait pas à
                  mon besoin, et ma quête pour une routine naturelle et saine s'est révélée être un véritable défi.
                </p>
                <p style={{ marginBottom: theme.spacing.lg }}>
                  C'est ainsi qu'est née <strong>NOVÉDEN</strong>. Dès lors, j'ai reconnu chaque femme à la beauté
                  originelle et respecter sa singularité. C'est ainsi qu'est né le nom de la marque Novéden, une
                  marque qui, chaque femme à la beauté originale, au retour à la nature, vers Éden. Une marque où
                  Aujourd'hui, ma marque poursuit son évolution en affirmant sa démarche engagée, transparente et
                  guidée par la science. Elle cherche toujours à rester fidèle à la vision originale. Elle marque le
                  retour vers une beauté naturelle, pure, saine mais AUSSI scientifique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: theme.spacing.xl,
              marginBottom: theme.spacing['3xl'],
            }}
          >
            {[
              {
                icon: Sparkles,
                title: 'Excellence',
                description: 'Des actifs sélectionnés pour leur efficacité et leur tolérance',
              },
              {
                icon: Truck,
                title: 'Livraison Gratuit',
                description: 'Livraison offerte en Belgique dès 65€ d\'achat',
              },
              {
                icon: Award,
                title: 'Qualité Premium',
                description: 'Laboratoire Français et Belge',
              },
              {
                icon: Heart,
                title: 'Engagement',
                description: 'Des formules naturelles et efficaces pour des résultats visibles',
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                  textAlign: 'center',
                }}
              >
                <feature.icon
                  size={48}
                  color={theme.colors.primary.main}
                  style={{ margin: `0 auto ${theme.spacing.md}` }}
                />
                <h3
                  style={{
                    ...theme.heading.h5,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.body,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              ...theme.heading.h2,
              marginBottom: theme.spacing.xl,
              textAlign: 'center',
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
            }}
          >
            <p style={{ marginBottom: theme.spacing.lg }}>
              <strong>NOVÉDEN</strong> est une marque de cosmétiques naturels dédiée à la beauté de tous les types de
              peau, y compris les peaux sensibles, et des cheveux texturés. Nos soins s'inspirent de la nature,
              des traditions comme l'Ayurveda et de la science dermo-cosmétique pour offrir des soins sains,
              et efficaces.
            </p>

            <h3
              style={{
                ...theme.heading.h4,
                marginTop: theme.spacing['2xl'],
                marginBottom: theme.spacing.lg,
              }}
            >
              Notre mission
            </h3>
            <p style={{ marginBottom: theme.spacing.lg }}>
              Créer des soins naturels inspirés de la nature, qui respectent chaque type de peau, et chaque type de
              cheveux, pour révéler votre beauté réelle, sans masquer ni fragiliser. Des formules saines, parées pour
              révéler la beauté naturelle de chacun, en harmonie avec sa peau et ses cheveux, sans agresser ni altérer.
            </p>

            <h3
              style={{
                ...theme.heading.h4,
                marginTop: theme.spacing['2xl'],
                marginBottom: theme.spacing.lg,
              }}
            >
              Notre vision
            </h3>
            <p style={{ marginBottom: theme.spacing.lg }}>
              Le retour à une beauté naturelle, pure, authentique et globale. Comme un véritable retour en
              Éden, lieu où l'être vit avec des soins chimiques qui nuisent à long terme à votre santé comme
              Novéden, une marque inclusive, qui célèbre chaque personne.
            </p>

            <h3
              style={{
                ...theme.heading.h4,
                marginTop: theme.spacing['2xl'],
                marginBottom: theme.spacing.lg,
              }}
            >
              Notre expertise
            </h3>
            <p style={{ marginBottom: theme.spacing.lg }}>
              Chaque formule est élaborée autour d'actifs végétaux rigoureusement sélectionnés, d'une
              combinaison unique d'huiles végétales et d'extraits naturels, pour nourrir, protéger et sublimer
              la peau et les cheveux efficacement. Par ailleurs, Nous travaillons avec des laboratoires français et
              belges, pour garantir les meilleurs standards de qualité, afin de nourrir, protéger et révéler la beauté
              naturelle de la peau et les cheveux naturellement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
