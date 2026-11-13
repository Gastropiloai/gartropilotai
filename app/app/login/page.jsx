
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main style={{
      maxWidth: 420,
      margin: "100px auto",
      padding: 30,
      fontFamily: "Arial, sans-serif",
    }}>
      <h1>GastroPilot AI</h1>
      <h2>Restaurant-Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 12, marginBottom: 15 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            background: "#16a34a",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Anmeldung läuft..." : "Anmelden"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
