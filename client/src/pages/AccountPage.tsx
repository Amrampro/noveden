// client/src/pages/AccountPage.tsx
import React, { useEffect, useState } from "react";
import { theme } from "../config/theme";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { ambassadorsService } from "../services/ambassadorsService";

import { Link, useNavigate } from "react-router-dom";

export function AccountPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);

  const [amb, setAmb] = useState<any>(null);
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const navigate = useNavigate();

  const savePassword = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);

    try {
      if (!currentPassword || !newPassword || !newPassword2) {
        throw new Error("Veuillez remplir tous les champs mot de passe.");
      }
      if (newPassword !== newPassword2) {
        throw new Error(
          "Les deux nouveaux mots de passe ne correspondent pas.",
        );
      }
      if (newPassword.length < 8) {
        throw new Error(
          "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        );
      }

      await api.updatePassword({ currentPassword, newPassword });

      setMsg("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPassword2("");
    } catch (e: any) {
      setErr(e?.message || "Erreur mise à jour mot de passe");
    } finally {
      setBusy(false);
    }
  };

  const load = async () => {
    setErr(null);
    setMsg(null);
    try {
      const p = await api.getProfile();
      setProfile(p?.user || p);

      const a = await ambassadorsService.getMe();
      const ambassador = a?.ambassador || null;
      setAmb(ambassador);

      setIban(ambassador?.iban || "");
      setBankName(ambassador?.bank_account_name || "");
    } catch (e: any) {
      setErr(e?.message || "Erreur de chargement");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveProfile = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await api.updateProfile({
        firstName: profile?.first_name ?? profile?.firstName ?? "",
        lastName: profile?.last_name ?? profile?.lastName ?? "",
        phone: profile?.phone ?? "",
      });
      setMsg("Profil mis à jour.");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erreur mise à jour profil");
    } finally {
      setBusy(false);
    }
  };

  const createAmbassador = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await ambassadorsService.register({
        iban: iban.trim() || undefined,
        bank_account_name: bankName.trim() || undefined,
      });
      setMsg("Compte ambassadeur créé.");
      setAmb(r?.ambassador || null);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erreur création ambassadeur");
    } finally {
      setBusy(false);
    }
  };

  const saveAmbassadorBank = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await ambassadorsService.updateBank({
        iban: iban.trim() || null,
        bank_account_name: bankName.trim() || null,
      });
      setMsg("Informations bancaires mises à jour.");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erreur mise à jour IBAN");
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
      <div style={{ padding: theme.spacing.xl }}>
        <Button variant="primary" onClick={() => navigate("/")}>
          Retour à l'accueil
        </Button>
      </div>
      <div
        style={{
          maxWidth: theme.container.maxWidth,
          margin: "0 auto",
          padding: theme.spacing["2xl"],
        }}
      >
        <h1 style={{ ...theme.heading.h2 }}>Mon compte</h1>

        {err && (
          <div
            style={{
              marginTop: theme.spacing.md,
              color: theme.colors.error.main,
            }}
          >
            {err}
          </div>
        )}
        {msg && (
          <div
            style={{
              marginTop: theme.spacing.md,
              color: theme.colors.primary.main,
            }}
          >
            {msg}
          </div>
        )}

        {/* AMBASSADOR */}
        <div style={card()}>
          <h3 style={{ ...theme.heading.h4, marginTop: 0 }}>Ambassadeur</h3>

          {amb ? (
            <>
              <div
                style={{ ...theme.body.base, marginBottom: theme.spacing.md }}
              >
                Votre code :{" "}
                <b style={{ fontFamily: "monospace" }}>{amb.code}</b>
              </div>

              <div style={{ display: "grid", gap: theme.spacing.md }}>
                <input
                  style={inputStyle()}
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="IBAN"
                />
                <input
                  style={inputStyle()}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Nom de banque / titulaire"
                />
              </div>

              <div
                style={{
                  marginTop: theme.spacing.lg,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {""}
                <Button
                  variant="primary"
                  onClick={saveAmbassadorBank}
                  disabled={busy}
                >
                  {busy ? "Enregistrement..." : "Mettre à jour"}
                </Button>
              </div>
              <Button variant="primary" onClick={() => navigate("/ambassador")}>
                Voir mon compte ambassadeur
              </Button>
            </>
          ) : (
            <>
              <div
                style={{
                  ...theme.body.base,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.md,
                }}
              >
                Vous n’avez pas encore de compte ambassadeur. Vous pouvez en
                créer un maintenant.
              </div>

              <div style={{ display: "grid", gap: theme.spacing.md }}>
                <input
                  style={inputStyle()}
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="IBAN (optionnel)"
                />
                <input
                  style={inputStyle()}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Nom de banque / titulaire (optionnel)"
                />
              </div>

              <div
                style={{
                  marginTop: theme.spacing.lg,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="primary"
                  onClick={createAmbassador}
                  disabled={busy}
                >
                  {busy ? "Création..." : "Créer mon compte ambassadeur"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* PROFIL */}
        <div style={card()}>
          <h3 style={{ ...theme.heading.h4, marginTop: 0 }}>
            Mes informations
          </h3>

          <div style={{ display: "grid", gap: theme.spacing.md }}>
            <input
              style={inputStyle()}
              value={profile?.first_name ?? ""}
              onChange={(e) =>
                setProfile((s: any) => ({ ...s, first_name: e.target.value }))
              }
              placeholder="Prénom"
            />
            <input
              style={inputStyle()}
              value={profile?.last_name ?? ""}
              onChange={(e) =>
                setProfile((s: any) => ({ ...s, last_name: e.target.value }))
              }
              placeholder="Nom"
            />
            <input
              style={inputStyle()}
              value={profile?.phone ?? ""}
              onChange={(e) =>
                setProfile((s: any) => ({ ...s, phone: e.target.value }))
              }
              placeholder="Téléphone"
            />
          </div>

          <div
            style={{
              marginTop: theme.spacing.lg,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="primary" onClick={saveProfile} disabled={busy}>
              {busy ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>

        {/* PASSWORD */}
        <div style={card()}>
          <h3 style={{ ...theme.heading.h4, marginTop: 0 }}>Sécurité</h3>

          <div style={{ display: "grid", gap: theme.spacing.md }}>
            <input
              style={inputStyle()}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mot de passe actuel"
              autoComplete="current-password"
            />

            <input
              style={inputStyle()}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
            />

            <input
              style={inputStyle()}
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              placeholder="Confirmer le nouveau mot de passe"
              autoComplete="new-password"
            />
          </div>

          <div
            style={{
              marginTop: theme.spacing.lg,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="primary" onClick={savePassword} disabled={busy}>
              {busy ? "Enregistrement..." : "Mettre à jour le mot de passe"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function card(): React.CSSProperties {
  return {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.light}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
  };
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border.main}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.background.primary,
    outline: "none",
  };
}
