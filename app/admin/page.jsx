
"use client";


// Auth kommt gleich
// Supabase-Login folgt im nächsten Schritt
import { useState } from "react";


const demoOrders = [
  { id: 1042, type: "Im Laden", detail: "Tisch 7", items: "3 × Döner", status: "Neu" },
  { id: 1043, type: "Abholung", detail: "Abholung", items: "2 × Lahmacun", status: "In Zubereitung" },
  { id: 1044, type: "Lieferung", detail: "Lieferung", items: "1 × Döner, 1 × Pommes", status: "Abholbereit" }
];

export default function AdminPage() {
  const [orders, setOrders] = useState(demoOrders);

  function updateStatus(id) {
    setOrders((previous) =>
      previous.map((order) => {
        if (order.id !== id) return order;

        const next = {
          Neu: "In Zubereitung",
          "In Zubereitung": "Abholbereit",
          Abholbereit: "Abgeschlossen"
        };

        return {
          ...order,
          status: next[order.status] || order.status
        };
      })
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "auto" }}>
      <h1>GastroPilot AI</h1>
      <h2>Bestellverwaltung</h2>
      <p>Demo – noch keine echten Bestellungen</p>

      {orders.map((order) => (
        <section
          key={order.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 18,
            marginBottom: 16
          }}
        >
          <h3>Bestellung #{order.id}</h3>
          <p>{order.type} – {order.detail}</p>
          <p>{order.items}</p>
          <p><strong>Status: {order.status}</strong></p>

          {order.status !== "Abgeschlossen" && (
            <button
              onClick={() => updateStatus(order.id)}
              style={{
                padding: "12px 18px",
                background: "#166534",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer"
              }}
            >
              {order.status === "Neu"
                ? "Zubereitung starten"
                : order.status === "In Zubereitung"
                ? "Als bereit markieren"
                : "Abschließen"}
            </button>
          )}
        </section>
      ))}
    </main>
  );
}
