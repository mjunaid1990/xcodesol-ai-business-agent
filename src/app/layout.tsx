import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "orbit / AI — Business Agent Platform",
  description: "Your AI workforce control center.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
