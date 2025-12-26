import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bannerService } from "../services/bannerService";
import { theme } from "../config/theme";
import { Button } from "./Button"; // adjust import to your actual Button path

type BannerPageName = "home" | "shop" | "about" | "faqs" | "contact";

type Banner = {
  id: string;
  page_name: BannerPageName;
  title: string | null;
  subtitle: string | null;
  button: string | null;
  link: string | null;
  background_img: string | null;
  is_active: any;
  display_order: number;
};

type Props = {
  defaultKicker?: string; // ex: "CHEVEUX & PEAUX" (only used if banner exists)
};

function routeToPageName(pathname: string): BannerPageName | null {
  const p = (pathname || "").trim();

  if (p === "/" || p === "") return "home";
  if (p === "/shop" || p.startsWith("/shop/")) return "shop";
  if (p === "/about" || p.startsWith("/about/")) return "about";
  if (p === "/faqs" || p.startsWith("/faqs/")) return "faqs";
  if (p === "/contact" || p.startsWith("/contact/")) return "contact";

  return null; // no banner on other pages
}

const toBool = (v: any) => v === true || v === 1 || v === "1";

export function PageBanner({ defaultKicker = "" }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const pageName = useMemo(
    () => routeToPageName(location.pathname),
    [location.pathname]
  );

  const [banner, setBanner] = useState<Banner | null>(null);
  const [loaded, setLoaded] = useState(false); // crucial to avoid flash
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setError(null);

      // If route not handled => nothing
      if (!pageName) {
        if (!mounted) return;
        setBanner(null);
        setLoaded(true);
        return;
      }

      setLoaded(false);

      try {
        const resp = await bannerService.getActiveBannerByPageName(pageName);
        if (!mounted) return;

        // If API returns null => NO banner at all
        setBanner(resp?.banner ?? null);
      } catch (e: any) {
        if (!mounted) return;
        setBanner(null); // important: no fallback UI
        setError(e?.message || "Failed to load banner");
      } finally {
        if (!mounted) return;
        setLoaded(true);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [pageName]);

  // While loading, render nothing (prevents blank block)
  if (!loaded) return null;

  // If no banner => render NOTHING (your requirement)
  if (!banner) return null;

  // If banner exists but inactive => render NOTHING
  if (!toBool(banner.is_active)) return null;

  // Trim all
  const bgImage = (banner.background_img || "").trim();
  const title = (banner.title || "").trim();
  const subtitle = (banner.subtitle || "").trim();
  const buttonText = (banner.button || "").trim();
  const buttonLink = (banner.link || "").trim();

  const showCta = Boolean(buttonText && buttonLink);

  // OPTIONAL strict rule:
  // If banner exists but has absolutely no useful content => render nothing.
  // (Remove this block if you want an "empty banner" to still show default look.)
  const hasAnyContent = Boolean(title || subtitle || bgImage || showCta);
  if (!hasAnyContent) return null;

  const sectionStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.sage,
    padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
    position: "relative",
    overflow: "hidden",
    ...(bgImage
      ? {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
  };

  const onNavigate = (to: string) => {
    const path = to.startsWith("/") ? to : `/${to}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section style={sectionStyle}>
      <div
        style={{
          maxWidth: theme.container.maxWidth,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: theme.spacing["3xl"],
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="hero-grid"
      >
        <div style={{ textAlign: "center" }}>
          {/* Title only if exists */}
          {title ? (
            <h1
              style={{
                ...theme.heading.h1,
                fontSize: "3.5rem",
                marginBottom: theme.spacing.lg,
                fontStyle: "italic",
              }}
            >
              {title}
            </h1>
          ) : null}

          {/* Subtitle only if exists */}
          {subtitle ? (
            <h2
              style={{
                ...theme.heading.h2,
                fontSize: "2.5rem",
                marginBottom: theme.spacing.md,
                fontStyle: "italic",
              }}
            >
              {subtitle}
            </h2>
          ) : null}

          {/* Kicker only if provided (and only if banner exists) */}
          {/* {subtitle ? (
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.xl,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing["2xl"],
                letterSpacing: theme.typography.letterSpacing.wide,
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </p>
          ) : null} */}

          {/* CTA only if DB provides it */}
          {showCta ? (
            <div
              style={{
                display: "flex",
                gap: theme.spacing.md,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="primary"
                size="medium"
                onClick={() => onNavigate(buttonLink)}
              >
                {buttonText}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
