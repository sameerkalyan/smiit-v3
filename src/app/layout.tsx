import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/custom-cursor";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-intro-mono",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hero",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMIIT CyberAI — AI Governance & Infrastructure Consultancy",
  description:
    "SMIIT CyberAI is a London-based specialist consulting firm for AI Governance & Infrastructure in regulated industries. EU AI Act compliance, cloud architecture, and forward-deployed engineers.",
  keywords: [
    "AI Governance",
    "EU AI Act",
    "NIST AI RMF",
    "ISO 42001",
    "Cloud Infrastructure",
    "AI Agents",
    "Cybersecurity",
    "London",
  ],
  authors: [{ name: "SMIIT CyberAI" }],
  openGraph: {
    title: "SMIIT CyberAI — AI Governance & Infrastructure",
    description:
      "Specialist AI governance and infrastructure consultancy for regulated industries. London, UK.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMIIT CyberAI",
    description: "AI Governance & Infrastructure Consultancy for regulated enterprise.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F6" },
    { media: "(prefers-color-scheme: dark)", color: "#06070c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetBrainsMono.variable} ${inter.variable} ${ibmPlexMono.variable} ${bebasNeue.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("smiit-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.setAttribute("data-theme","light")}}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`,
          }}
        />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <CustomCursor />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--brutalist-accent)] focus:text-[var(--brutalist-accent-foreground)] focus:font-mono focus:text-xs focus:uppercase">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
