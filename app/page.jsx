"use client";

import { useState } from "react";

const produkte = [
  { id: 1, name: "Döner Hähnchen groß", preis: 7.5, kategorie: "Döner" },
  { id: 2, name: "Döner Kalb groß", preis: 8.5, kategorie: "Döner" },
  { id: 3, name: "Döner Beefsteak groß", preis: 9.5, kategorie: "Döner" },
  { id: 4, name: "Döner Hähnchen mini", preis: 5, kategorie: "Döner" },
  { id: 5, name: "Lahmacun", preis: 4, kategorie: "Lahmacun" },
  { id: 6, name: "Lahmacun mit Salat", preis: 6.5, kategorie: "Lahmacun" },
  { id: 7, name: "Lahmacun Spezial Hähnchen", preis: 8.5, kategorie: "Lahmacun" },
  { id: 8, name: "Pizza Margherita 26 cm", preis: 8.5, kategorie: "Pizza" },
  { id: 9, name: "Pizza Margherita 30 cm", preis: 9, kategorie: "Pizza" },
  { id: 10, name: "Pizza Funghi 26 cm", preis: 9.5, kategorie: "Pizza" },
  { id: 11, name: "Pizza Funghi 30 cm", preis: 10.5, kategorie: "Pizza" },
  { id: 12, name: "Cola 0,33 l", preis: 2.5, kategorie: "Getränke" },
  { id: 13, name: "Fanta 0,33 l", preis: 2.5, kategorie: "Getränke" },
  { id: 14, name: "Ayran 0,25 l", preis: 2, kategorie: "Getränke" },
];

const euro = (betrag) => betrag.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function Home() {
  const [warenkorb, setWarenkorb] = useState({});
  const [kategorie, setKategorie] = useState("Alle");
  const [abholung, setAbholung] = useState(true);
  const [hinweis, setHinweis] = useState("");
  const anzahl = Object.values(warenkorb).reduce((summe, menge) => summe + menge, 0);
  const summe = produkte.reduce((gesamt, produkt) => gesamt + produkt.preis * (warenkorb[produkt.id] || 0), 0);

  function mengeAendern(id, delta) {
    setWarenkorb((alt) => ({ ...alt, [id]: Math.max(0, (alt[id] || 0) + delta) }));
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f6f7fb", color: "#172033", fontFamily: "Arial, sans-serif", padding: "28px 16px" }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <header style={{ background: "#101827", color: "white", borderRadius: 18, padding: 28, marginBottom: 24 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 32 }}>GastroPilot AI</h1>
          <p style={{ margin: "0 0 12px", color: "#d1d5db" }}>Digitale Speisekarte – Döner Point Kassel</p>
          <strong style={{ color: "#fbbf24" }}>TESTVERSION – keine echte Bestellübermittlung</strong>
        </header>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "flex-start" }}>
          <section style={{ flex: "2 1 430px" }}>
            <h2>Speisekarte</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {["Alle", "Döner", "Lahmacun", "Pizza", "Getränke"].map((name) => (
                <button key={name} onClick={() => setKategorie(name)} style={{ padding: "10px 15px", borderRadius: 20, border: "1px solid #d1d5db", background: kategorie === name ? "#101827" : "white", color: kategorie === name ? "white" : "#172033", cursor: "pointer" }}>{name}</button>
              ))}
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {produkte.filter((p) => kategorie === "Alle" || p.kategorie === kategorie).map((produkt) => (
                <div key={produkt.id} style={{ background: "white", borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, boxShadow: "0 2px 8px #0000000a" }}>
                  <div><strong>{produkt.name}</strong><div style={{ marginTop: 6, color: "#475569" }}>{euro(produkt.preis)}</div></div>
                  <button onClick={() => mengeAendern(produkt.id, 1)} style={{ background: "#15803d", color: "white", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>+ Hinzufügen</button>
                </div>
              ))}
            </div>
          </section>
          <aside style={{ flex: "1 1 280px", background: "white", padding: 20, borderRadius: 16, boxShadow: "0 2px 12px #00000010" }}>
            <h2 style={{ marginTop: 0 }}>Warenkorb ({anzahl})</h2>
            {anzahl === 0 ? <p>Dein Warenkorb ist noch leer.</p> : produkte.filter((p) => warenkorb[p.id] > 0).map((produkt) => (
              <div key={produkt.id} style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 0" }}>
                <strong>{produkt.name}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => mengeAendern(produkt.id, -1)} aria-label={`${produkt.name} entfernen`}>−</button>
                    <span>{warenkorb[produkt.id]}</span>
                    <button onClick={() => mengeAendern(produkt.id, 1)} aria-label={`${produkt.name} hinzufügen`}>+</button>
                  </div>
                  <span>{euro(produkt.preis * warenkorb[produkt.id])}</span>
                </div>
              </div>
            ))}
            <h3>Zwischensumme: {euro(summe)}</h3>
            <p style={{ fontSize: 13, color: "#64748b" }}>Testpreise gemäß Speisekarte. Lieferkosten sind nicht enthalten.</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <label><input type="radio" checked={abholung} onChange={() => setAbholung(true)} /> Abholung</label>
              <label><input type="radio" checked={!abholung} onChange={() => setAbholung(false)} /> Lieferung</label>
            </div>
            {!abholung && <p style={{ fontSize: 13 }}>Lieferung ab 20,00 € Warenwert; Liefergebiet und Gebühren müssen noch geprüft werden.</p>}
            <label htmlFor="hinweis">Hinweis zur Testbestellung</label>
            <textarea id="hinweis" value={hinweis} onChange={(e) => setHinweis(e.target.value)} placeholder="Zum Beispiel: ohne Zwiebeln" rows={3} style={{ display: "block", width: "100%", boxSizing: "border-box", margin: "8px 0 14px", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }} />
            <button disabled={anzahl === 0} onClick={() => alert("Dies ist nur eine Demo. Es wurde keine Bestellung versendet.")} style={{ width: "100%", background: anzahl ? "#15803d" : "#94a3b8", color: "white", border: 0, padding: 14, borderRadius: 10, cursor: anzahl ? "pointer" : "not-allowed" }}>Testbestellung prüfen</button>
          </aside>
        </div>
        <footer style={{ marginTop: 28, textAlign: "center", color: "#64748b", fontSize: 13 }}>GastroPilot AI · Prototyp · Noch keine Online-Bestellung möglich</footer>
      </div>
    </main>
  );
}
