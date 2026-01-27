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
  title: "Green Repo | Check your repo's eco-friendliness",
  description: "Evaluate your repository's carbon footprint.",
  icons: {
    icon: '/greenrepo/favicon.svg',
  },
    alternates: {
      canonical: 'https://nikhilp.online/greenrepo',
    },
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
