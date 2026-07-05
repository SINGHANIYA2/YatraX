

import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import Provider from "@/lib/Provider";
import ReduxProvider from "@/redux/ReduxProvider";
import InitUser from "@/InitUser";
import PartnerLocationTracker from "@/components/PartnerLocationTracker";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import ThemeScript from "@/lib/theme/ThemeScript";
import FloatingThemeToggle from "@/components/theme/FloatingThemeToggle";

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