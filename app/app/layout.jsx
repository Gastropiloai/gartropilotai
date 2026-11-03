
export const metadata = {
  title: "GastroPilot AI",
  description: "Intelligenter Bestellassistent für die Gastronomie",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
