// @ts-expect-error Next.js processes this stylesheet import at build time.
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Lokoja Flood Risk Map",
  description: "Flood susceptibility, exposure and risk for Lokoja LGA, Kogi State",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
