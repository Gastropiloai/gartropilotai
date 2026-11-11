
export const runtime = "nodejs";

const RESTAURANT =
  "Görlitzer Straße 39 B, 34123 Kassel, Deutschland";

const MAX_KM = 7;

async function koordinaten(adresse, apiKey) {
  const url = new URL(
    "https://api.openrouteservice.org/geocode/search"
  );

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("text", adresse);
  url.searchParams.set("boundary.country", "DE");
  url.searchParams.set("size", "1");

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Geocoding fehlgeschlagen");
  }

  const data = await response.json();
  const punkt = data.features?.[0]?.geometry?.coordinates;

  if (!punkt) {
    return null;
  }

  return punkt;
}

export async function POST(request) {
  try {
    const { adresse } = await request.json();

    if (
      typeof adresse !== "string" ||
      adresse.trim().length < 8
    ) {
      return Response.json(
        { error: "Bitte vollständige Lieferadresse eingeben." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTESERVICE_API_KEY;

    if (!apiKey) {
      throw new Error("API-Schlüssel fehlt");
    }

    const start = await koordinaten(RESTAURANT, apiKey);
    const ziel = await koordinaten(adresse, apiKey);

    if (!start || !ziel) {
      return Response.json(
        {
          lieferbar: false,
          error: "Adresse konnte nicht gefunden werden.",
        },
        { status: 422 }
      );
    }

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [start, ziel],
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Routenberechnung fehlgeschlagen");
    }

    const data = await response.json();
    const meter = data.routes?.[0]?.summary?.distance;

    if (typeof meter !== "number") {
      throw new Error("Keine Fahrstrecke gefunden");
    }

    const kilometer = Number((meter / 1000).toFixed(2));
    const lieferbar = meter <= MAX_KM * 1000;

    return Response.json({
      lieferbar,
      entfernungKm: kilometer,
      maximaleEntfernungKm: MAX_KM,
      nachricht: lieferbar
        ? "Lieferadresse liegt im Liefergebiet."
        : "Leider liegt die Adresse außerhalb unseres Liefergebiets.",
    });
  } catch (error) {
    console.error("Liefergebietsprüfung:", error.message);

    return Response.json(
      {
        lieferbar: false,
        error: "Liefergebiet konnte nicht geprüft werden.",
      },
      { status: 503 }
    );
  }
}
