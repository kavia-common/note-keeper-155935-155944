import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Note Keeper",
  description:
    "A modern, minimalistic notes app with fast search and distraction-free editing.",
  applicationName: "Note Keeper",
  authors: [{ name: "Note Keeper" }],
  keywords: ["notes", "editor", "nextjs", "minimal", "productivity"],
  colorScheme: "light",
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
