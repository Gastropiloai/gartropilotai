                  <button onClick={() => mengeAendern(p.id, 1)} style={{ background: "#15803d", color: "white", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>+ Hinzufügen</button>
                </div>
              ))}
            </div>
          </section>
          <aside style={{ flex: "1 1 300px", background: "white", padding: 20, borderRadius: 16 }}>
            <h2>Warenkorb ({anzahl})</h2>
            {anzahl === 0 && <p>Dein Warenkorb ist noch leer.</p>}
            {positionen.map((p) => (
              <div key={p.id} style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 0" }}>
                <strong>{p.name}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={() => mengeAendern(p.id, -1)} aria-label={`${p.name} entfernen`}>−</button>
                    <span>{warenkorb[p.id]}</span>
                    <button onClick={() => mengeAendern(p.id, 1)} aria-label={`${p.name} hinzufügen`}>+</button>
                  </div>
                  <span>{euro(p.preis * warenkorb[p.id])}</span>
                </div>
              </div>
            ))}
            <h3>Zwischensumme: {euro(summe)}</h3>
            <p style={{ fontSize: 13, color: "#64748b" }}>Lieferkosten werden erst nach Prüfung der Entfernung festgelegt und sind hier nicht enthalten.</p>
            <fieldset style={{ border: 0, padding: 0, marginBottom: 12 }}>
              <legend>Bestellart</legend>
              <label><input type="radio" name="art" checked={!lieferung} onChange={() => { setArt("Abholung"); setVorschau(false); }} /> Abholung</label>{" "}
              <label><input type="radio" name="art" checked={lieferung} onChange={() => { setArt("Lieferung"); setVorschau(false); }} /> Lieferung</label>
            </fieldset>
            {lieferung && !mindestwertErreicht && <p role="alert" style={{ color: "#b91c1c" }}>Für Lieferung fehlen noch {euro(20 - summe)} zum Mindestbestellwert von 20 €.</p>}
            <form onSubmit={(e) => { e.preventDefault(); if (formularGueltig) { setVorschau(true); setBestaetigt(false); } }}>
              <label>Name<input style={feld} required value={name} onChange={(e) => { setName(e.target.value); setVorschau(false); }} /></label>
              <label>Telefonnummer<input style={feld} type="tel" required value={telefon} onChange={(e) => { setTelefon(e.target.value); setVorschau(false); }} /></label>
              {lieferung && <>
                <label>Straße und Hausnummer<input style={feld} required value={strasse} onChange={(e) => { setStrasse(e.target.value); setVorschau(false); }} /></label>
                <label>Postleitzahl<input style={feld} required value={plz} onChange={(e) => { setPlz(e.target.value); setVorschau(false); }} /></label>
                <label>Ort<input style={feld} required value={ort} onChange={(e) => { setOrt(e.target.value); setVorschau(false); }} /></label>
              </>}
              <label>Sonderwünsche<textarea style={feld} rows={3} value={hinweis} onChange={(e) => { setHinweis(e.target.value); setVorschau(false); }} placeholder="Zum Beispiel: ohne Zwiebeln" /></label>
              <button type="submit" disabled={!formularGueltig} style={{ marginTop: 14, width: "100%", padding: 14, border: 0, borderRadius: 10, background: formularGueltig ? "#15803d" : "#94a3b8", color: "white", cursor: formularGueltig ? "pointer" : "not-allowed" }}>Bestellung überprüfen</button>
            </form>
            {vorschau && <section style={{ marginTop: 20, padding: 14, background: "#f1f5f9", borderRadius: 10 }}>
              <h3>Bestellübersicht (Demo)</h3>
              {positionen.map((p) => <p key={p.id}>{warenkorb[p.id]} × {p.name}: {euro(p.preis * warenkorb[p.id])}</p>)}
              <p><strong>Warenwert: {euro(summe)}</strong></p>
              <p>{art} · {name} · {telefon}</p>
              {lieferung && <p>{strasse}, {plz} {ort}</p>}
              {hinweis && <p>Hinweis: {hinweis}</p>}
              {lieferung && <p>Liefergebühr und Liefergebiet sind noch nicht geprüft. Kein verbindlicher Endpreis.</p>}
              <button type="button" onClick={() => setBestaetigt(true)} style={{ padding: 12, border: 0, borderRadius: 8, background: "#101827", color: "white" }}>Testbestellung bestätigen</button>
              {bestaetigt && <p role="status"><strong>Demo erfolgreich durchgespielt.</strong> Es wurde keine Bestellung gesendet, gespeichert oder bezahlt.</p>}
            </section>}
          </aside>
        </div>
        <footer style={{ marginTop: 28, textAlign: "center", color: "#64748b", fontSize: 13 }}>GastroPilot AI · Prototyp · Noch keine Online-Bestellung möglich</footer>
      </div>
    </main>
  );
}
