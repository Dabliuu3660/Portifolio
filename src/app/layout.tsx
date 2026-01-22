import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/accessibility/SkipToContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://arthurmatumoto.com'),
  title: {
    default: "Arthur Matumoto | Designer Gráfico & Editor de Vídeos",
    template: "%s | Arthur Matumoto Portfolio",
  },
  description:
    "Portfolio de Arthur Santos Matumoto - Designer especializado em E-commerce, infoprodutos e edição de vídeos. Conheça meus trabalhos.",
  keywords: [
    "designer gráfico",
    "motion design",
    "editor de vídeo",
    "e-commerce design",
    "social media",
    "portfolio",
    "Arthur Matumoto",
    "design gráfico Brasil",
  ],
  authors: [{ name: "Arthur Santos Matumoto" }],
  creator: "Arthur Santos Matumoto",
  publisher: "Arthur Santos Matumoto",
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Arthur Matumoto Portfolio",
    title: "Arthur Matumoto | Designer Gráfico & Editor de Vídeos",
    description: "Portfolio de Arthur Santos Matumoto - Designer especializado em E-commerce e Motion Design.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Arthur Matumoto - Designer Gráfico & Editor de Vídeos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arthur Matumoto | Designer Gráfico & Editor de Vídeos",
    description: "Portfolio de Arthur Santos Matumoto - Designer especializado em E-commerce e Motion Design.",
    images: ["/og-image.jpg"],
  },
  verification: {
    // Adicionar códigos de verificação quando disponíveis
    // google: 'codigo-google-search-console',
    // yandex: 'codigo-yandex',
    // bing: 'codigo-bing',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <SkipToContent />
          <Header />
          <main id="main-content" className="pt-24 min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
