import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Bravo AI — Workforce Intelligence Platform",
  description:
    "AI-powered retail workforce optimization, FIFO compliance, and waste-reduction intelligence for Bravo Supermarkets.",
};

// Applied before paint so the theme never flashes. Defaults to dark.
const noFlashTheme = `(function(){try{var t=localStorage.getItem('bravo-theme');if(t!=='light')t='dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashTheme }} />
      </head>
      <body className="bg-bg text-fg antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
