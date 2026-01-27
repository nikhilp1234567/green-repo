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
  metadataBase: new URL('https://nikhilp.online'),
  title: {
    default: "Green Repo | Check your repo's eco-friendliness",
    template: "%s | Green Repo"
  },
  description: "Evaluate your GitHub repository's carbon footprint and digital sustainability score. Free tool for eco-conscious developers.",
  keywords: ["green code", "sustainable software", "carbon footprint", "github analysis", "eco-friendly coding", "digital sustainability", "software energy efficiency"],
  authors: [{ name: "Nikhil Parmar", url: "https://nikhilp.online" }],
  creator: "Nikhil Parmar",
  icons: {
    icon: '/greenrepo/favicon.svg',
    apple: '/greenrepo/favicon.svg',
  },
  alternates: {
    canonical: 'https://nikhilp.online/greenrepo',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nikhilp.online/greenrepo",
    title: "Green Repo | Check your repo's eco-friendliness",
    description: "Evaluate your repository's carbon footprint. Build more sustainable software.",
    siteName: "Green Repo",
    images: [
      {
        url: "/greenrepo/og-image.jpg", // Assuming you might have one or we use a default
        width: 1200,
        height: 630,
        alt: "Green Repo Interface",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Repo | Check your repo's eco-friendliness",
    description: "Evaluate your repository's carbon footprint. Build more sustainable software.",
    creator: "@nikhilparmar", // Replace with actual handle if known, or remove
    images: ["/greenrepo/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Green Repo",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Evaluate your repository's carbon footprint and eco-friendliness.",
  "author": {
    "@type": "Person",
    "name": "Nikhil Parmar",
    "url": "https://nikhilp.online"
  }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
