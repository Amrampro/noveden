import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    MR_ParcelShopPicker?: any;
  }
}

type Relay = {
  id: string;
  name?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

type Props = {
  brandCode: string;              // ex: "BDTEST13" ou ton code MR
  country: string;                // "BE"
  postCode: string;               // "1000"
  onSelect: (relay: Relay) => void;
};

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      // script déjà là
      existing.addEventListener("load", () => resolve());
      // s’il est déjà chargé, resolve direct
      if ((existing as any)._loaded) return resolve();
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      (s as any)._loaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(s);
  });
}

export function MondialRelayPicker({ brandCode, country, postCode, onSelect }: Props) {
  const containerIdRef = useRef(`mr-picker-${Math.random().toString(16).slice(2)}`);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 1) Charger le script Mondial Relay
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        setErr(null);

        // ⚠️ Script officiel MR (widget ParcelShopPicker)
        // Si tu utilises un autre lien dans ta doc MR, remplace-le ici.
        const src = "https://widget.mondialrelay.com/parcelshop-picker/v4_0/scripts/parcelshop-picker.js";

        await loadScriptOnce(src);

        if (cancelled) return;

        if (!window.MR_ParcelShopPicker) {
          throw new Error("MR_ParcelShopPicker introuvable après chargement du script.");
        }

        setReady(true);
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message || "Erreur chargement Mondial Relay");
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Initialiser le widget quand ready + postCode valide
  useEffect(() => {
    if (!ready) return;

    // empêche les appels inutiles
    const pc = (postCode || "").trim();
    if (pc.length < 3) return;

    try {
      // IMPORTANT: certains widgets nécessitent un conteneur vide => on reset
      const el = document.getElementById(containerIdRef.current);
      if (el) el.innerHTML = "";

      // Le widget crée un UI complet dans ton div
      // Les noms exacts des champs peuvent varier selon la version.
      window.MR_ParcelShopPicker({
        Target: `#${containerIdRef.current}`,
        Brand: brandCode,
        Country: country,
        PostCode: pc,

        // callback selection
        OnParcelShopSelected: (shop: any) => {
          // shop structure dépend de MR, on normalise
          const relay: Relay = {
            id: String(shop?.ID || shop?.Id || shop?.identifiant || shop?.ParcelShopId || ""),
            name: shop?.Name || shop?.Nom || null,
            address:
              shop?.Address ||
              shop?.Adresse ||
              [shop?.Address1, shop?.Address2].filter(Boolean).join(" ") ||
              null,
            city: shop?.City || shop?.Ville || null,
            postalCode: shop?.PostCode || shop?.CodePostal || null,
            country: shop?.Country || shop?.Pays || null,
          };

          if (!relay.id) return;
          onSelect(relay);
        },

        // Options UI (selon version)
        NbResults: 10,
        DisplayMapInfo: true,
        EnableMap: true,
      });
    } catch (e: any) {
      setErr(e?.message || "Impossible d'initialiser le widget Mondial Relay");
    }
  }, [ready, brandCode, country, postCode, onSelect]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>
        Entrez votre code postal puis choisissez un Point Relais sur la carte.
      </div>

      {err && (
        <div style={{ padding: 10, border: "1px solid #f00", color: "#b00", borderRadius: 8 }}>
          {err}
        </div>
      )}

      <div
        id={containerIdRef.current}
        style={{
          width: "100%",
          minHeight: 420,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.12)",
          background: "white",
        }}
      />
    </div>
  );
}
