import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  // No variable needed for direct application
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono", // Keeping mono variable for code blocks if needed, or can be direct too.
});

export const metadata: Metadata = {
  title: "Green Repo - Sustainable Software Engineering",
  description: "Evaluate your repository's carbon footprint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.className} ${jetbrainsMono.variable} antialiased font-light`}
      >
        {children}
      </body>
    </html>
  );
}
