

import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Provider from "../../src/lib/Provider";
import ReduxProvider from "../../src/redux/ReduxProvider";
import InitUser from "../../src/InitUser";
import PartnerLocationTracker from "../../src/components/PartnerLocationTracker";
import { ThemeProvider } from "../../src/lib/theme/ThemeProvider";
import ThemeScript from "../../src/lib/theme/ThemeScript";
import FloatingThemeToggle from "../../src/components/theme/FloatingThemeToggle";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YatraX",
  description: "Travel smoothly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <ThemeProvider>
          <Provider>
            <ReduxProvider>
              <InitUser />

              {/* Runs only for authenticated partners */}
              <PartnerLocationTracker />

              {children}
            </ReduxProvider>
          </Provider>
          <FloatingThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}