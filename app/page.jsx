"use client";

import { useMemo, useState } from "react";

const RESTAURANT_ADRESSE = "Görlitzer Straße 39 B, 34123 Kassel-Waldau";
const MAX_LIEFER_KM = 7;
const MINDESTBESTELLWERT = 20;

const liefergebuehrBerechnen = (km) => {
  if (km <= 2) return 2;
  if (km <= 4) return 3;
  if (km <= 5) return 4;
  if (km <= 7) return 5;
  return null;
};

const produkte = [
  { id: 1, name: "Döner Hähnchen groß", preis: 7.5, kategorie: "Döner" },
  { id: 2, name: "Döner Kalb groß", preis: 8.0, kategorie: "Döner" },
  { id: 3, name: "Döner Gemischt groß", preis: 8.0, kategorie: "Döner" },
  { id: 4, name: "Döner Hähnchen mini", preis: 5.0, kategorie: "Döner" },
  { id: 5, name: "Lahmacun", preis: 7.0, kategorie: "Lahmacun" },
  { id: 6, name: "Lahmacun mit Dönerfleisch", preis: 9.0, kategorie: "Lahmacun" },
  { id: 7, name: "Pizza Margherita", preis: 8.0, kategorie: "Pizza" },
  { id: 8, name: "Pizza Salami", preis: 9.0, kategorie: "Pizza" },
  { id: 9, name: "Pizza Tonno", preis: 9.5, kategorie: "Pizza" },
  { id: 10, name: "Pizza Döner", preis: 10.0, kategorie: "Pizza" },
  { id: 11, name: "Cola 0,33 l", preis: 2.5, kategorie: "Getränke" },
  { id: 12, name: "Fanta 0,33 l", preis: 2.5, kategorie: "Getränke" },
  { id: 13, name: "Sprite 0,33 l", preis: 2.5, kategorie: "Getränke" },
  { id: 14, name: "Ayran", preis: 2.0, kategorie: "Getränke" },
];

const euro = (wert) =>
  Number(wert).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const feld = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 5,
  marginBottom: 12,
  padding: 10,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: 15,
};

const knopf = {
  background: "#15803d",
  color: "white",
  border: 0,
  borderRadius: 8,
  padding: "9px 13px",
  cursor: "pointer",
};

export default function Home() {
  const [kategorie, setKategorie] = useState("Alle");
  const [warenkorb, setWarenkorb] = useState({});
  const [art, setArt] = useState("Abholung");
  const [name, setName] = useState("");
  const [telefon, setTelefon] = useState("");
  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");
  const [hinweis, setHinweis] = useState("");
  const [vorschau, setVorschau] = useState(false);
  const [bestaetigt, setBestaetigt] = useState(false);
  
const [lieferPruefung, setLieferPruefung] = useState(null);
const [prueftLiefergebiet, setPrueftLiefergebiet] = useState(false);


  const positionen = useMemo(
    () => produkte.filter((p) => (warenkorb[p.id] || 0) > 0),
    [warenkorb]
  );
  const anzahl = positionen.reduce((summe, p) => summe + warenkorb[p.id], 0);
  const summe = positionen.reduce(
    (gesamt, p) => gesamt + p.preis * warenkorb[p.id],
    0
  );
  const lieferung = art === "Lieferung";
  
const liefergebuehr =
  lieferung &&
  lieferPruefung?.lieferbar === true &&
  typeof lieferPruefung.entfernungKm === "number"
    ? liefergebuehrBerechnen(lieferPruefung.entfernungKm)
    : null;

const gesamtpreis =
  summe + (lieferung ? (liefergebuehr ?? 0) : 0);

  const mindestwertErreicht = !lieferung || summe >= 20;
  const formularGueltig =
    anzahl > 0 &&
    name.trim().length > 0 &&
    telefon.trim().length > 0 &&
    mindestwertErreicht &&
    (!lieferung ||
      (strasse.trim().length > 0 &&
        plz.trim().length > 0 &&
        ort.trim().length > 0));

async function liefergebietPruefen() {
  setPrueftLiefergebiet(true);
  setLieferPruefung(null);

  try {
    const adresse = `${strasse}, ${plz} ${ort}`;

    const antwort = await fetch("/api/liefergebiet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ adresse })
    });

    if (!antwort.ok) {
      throw new Error("Liefergebiet konnte nicht geprüft werden.");
    }

    const ergebnis = await antwort.json();

    if (typeof ergebnis.lieferbar !== "boolean") {
      throw new Error("Ungültige Antwort vom Server.");
    }

    setLieferPruefung(ergebnis);
    return ergebnis.lieferbar;
  } catch (fehler) {
    setLieferPruefung({
      lieferbar: false,
      nachricht: "Liefergebiet konnte nicht geprüft werden."
    });
    return false;
  } finally {
    setPrueftLiefergebiet(false);
  }
}

  

  function mengeAendern(id, differenz) {
    setWarenkorb((alt) => {
      const neu = { ...alt };
      neu[id] = Math.max(0, (neu[id] || 0) + differenz);
      return neu;
    });
    setVorschau(false);
    setBestaetigt(false);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif", color: "#172033" }}>
      <header style={{ background: "#111827", color: "white", padding: 24, borderRadius: 16, marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 8px" }}>GastroPilot AI</h1>
        <p style={{ margin: 0 }}>Döner Point – digitale Test-Bestellung</p>
        <p style={{ color: "#fbbf24", marginBottom: 0, fontSize: 13 }}>
          TESTVERSION – Keine echte Bestellung wird versendet.
        </p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
        <section style={{ flex: "2 1 360px", background: "#f8fafc", padding: 20, borderRadius: 16 }}>
          <h2>Speisekarte</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {["Alle", "Döner", "Lahmacun", "Pizza", "Getränke"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKategorie(k)}
                style={{ ...knopf, background: kategorie === k ? "#15803d" : "#64748b" }}
              >
                {k}
              </button>
            ))}
          </div>
          {produkte
            .filter((p) => kategorie === "Alle" || p.kategorie === kategorie)
            .map((p) => (
              <div key={p.id} style={{ background: "white", padding: 14, marginBottom: 10, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <strong>{p.name}</strong>
                  <div>{euro(p.preis)}</div>
                </div>
                <button type="button" onClick={() => mengeAendern(p.id, 1)} style={knopf}>
                  + Hinzufügen
                </button>
              </div>
            ))}
        </section>

        <aside style={{ flex: "1 1 310px", background: "white", border: "1px solid #e2e8f0", padding: 20, borderRadius: 16 }}>
          <h2>Warenkorb ({anzahl})</h2>
          {anzahl === 0 && <p>Dein Warenkorb ist noch leer.</p>}
          {positionen.map((p) => (
            <div key={p.id} style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 0" }}>
              <strong>{p.name}</strong>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button type="button" onClick={() => mengeAendern(p.id, -1)} aria-label={`${p.name} entfernen`}>−</button>
                  <span>{warenkorb[p.id]}</span>
                  <button type="button" onClick={() => mengeAendern(p.id, 1)} aria-label={`${p.name} hinzufügen`}>+</button>
                </div>
                <span>{euro(p.preis * warenkorb[p.id])}</span>
              </div>
            </div>
          ))}
          <h3>Zwischensumme: {euro(summe)}</h3>
          <p style={{ fontSize: 13, color: "#64748b" }}>
            Lieferkosten werden erst nach Prüfung der Entfernung festgelegt und sind hier nicht enthalten.
          </p>

          <fieldset style={{ border: 0, padding: 0, marginBottom: 12 }}>
            <legend>Bestellart</legend>
           <label style={{ marginRight: 12 }}>
  <input
    type="radio"
    name="art"
    checked={!lieferung}
    onChange={() => {
      setArt("Abholung");
      setVorschau(false);
      setLieferPruefung(null);
    }}
  /> Abholung
</label>
<label>
  <input
    type="radio"
    name="art"
    checked={lieferung}
    onChange={() => {
      setArt("Lieferung");
      setVorschau(false);
      setLieferPruefung(null);
    }}
  /> Lieferung
  
            </label>
          </fieldset>

          {lieferung && !mindestwertErreicht && (
            <p role="alert" style={{ color: "#b91c1c" }}>
              Für Lieferung fehlen noch {euro(20 - summe)} zum Mindestbestellwert von 20 €.
            </p>
          )}

          
<form onSubmit={async (e) => {
  e.preventDefault();
  if (!formularGueltig || prueftLiefergebiet) return;

  setVorschau(false);
  setBestaetigt(false);

  if (lieferung) {
    const istLieferbar = await liefergebietPruefen();
    if (!istLieferbar) return;
  }

  setVorschau(true);
}}>

            <label>Name<input style={feld} required value={name} onChange={(e) => { setName(e.target.value); setVorschau(false); }} /></label>
            <label>Telefonnummer<input style={feld} type="tel" required value={telefon} onChange={(e) => { setTelefon(e.target.value); setVorschau(false); }} /></label>
            {lieferung && (
              <>
                <label>Straße und Hausnummer<input style={feld} required value={strasse} onChange={(e) => { setStrasse(e.target.value); setVorschau(false);setLieferPruefung(null); }} /></label>
                <label>Postleitzahl<input style={feld} required value={plz} onChange={(e) => { setPlz(e.target.value); setVorschau(false);setLieferPruefung(null); }} /></label>
                <label>Ort<input style={feld} required value={ort} onChange={(e) => { setOrt(e.target.value); setVorschau(false);setLieferPruefung(null); }} /></label>
              </>
            )}
            <label>Sonderwünsche<textarea style={feld} rows={3} value={hinweis} onChange={(e) => { setHinweis(e.target.value); setVorschau(false); }} placeholder="Zum Beispiel: ohne Zwiebeln" /></label>
            <button type="submit" disabled={!formularGueltig} style={{ ...knopf, width: "100%", opacity: formularGueltig ? 1 : 0.5 }}>
              Bestellung prüfen
            </button>
          </form>
{lieferung && prueftLiefergebiet && (
  <p role="status">Lieferadresse wird geprüft...</p>
)}

{lieferung && lieferPruefung && !prueftLiefergebiet && (
  <p
    role="status"
    style={{
      color: lieferPruefung.lieferbar ? "green" : "red",
      fontWeight: "bold",
      marginTop: 12
    }}
  >
    {lieferPruefung.nachricht ||
      (lieferPruefung.lieferbar
        ? "Lieferung möglich."
        : "Lieferung nicht möglich.")}
  </p>
)}


          {vorschau && (
            <section style={{ marginTop: 20, padding: 14, background: "#f1f5f9", borderRadius: 10 }}>
              <h3>Bestellübersicht (Demo)</h3>
              {positionen.map((p) => (
                <p key={p.id}>{warenkorb[p.id]} × {p.name}: {euro(p.preis * warenkorb[p.id])}</p>
              ))}
              <p><strong>Warenwert: {euro(summe)}</strong></p>
              <p>{art} · {name} · {telefon}</p>
              {lieferung && <p>{strasse}, {plz} {ort}</p>}
              {hinweis && <p>Hinweis: {hinweis}</p>}
              
{lieferung ? (
  lieferPruefung?.lieferbar === true &&
  liefergebuehr !== null ? (
    <>
      <p>Liefergebühr: {euro(liefergebuehr)}</p>
      <p>
        <strong>Gesamtpreis: {euro(gesamtpreis)}</strong>
      </p>
    </>
  ) : (
    <p>Liefergebühr noch nicht geprüft. Kein verbindlicher Endpreis.</p>
  )
) : (
  <p><strong>Gesamtpreis: {euro(summe)}</strong></p>
)}

              <button type="button" onClick={() => setBestaetigt(true)} style={knopf}>
                Testbestellung bestätigen
              </button>
              {bestaetigt && (
                <p role="status"><strong>Demo erfolgreich durchgespielt.</strong> Es wurde keine Bestellung gesendet, gespeichert oder bezahlt.</p>
              )}
            </section>
          )}
        </aside>
      </div>
      <footer style={{ marginTop: 28, textAlign: "center", color: "#64748b", fontSize: 13 }}>
        GastroPilot AI · Prototyp · Noch keine Online-Bestellung möglich
      </footer>
    </main>
  );
}
