import type { Metadata } from "next";
import { UserProvider } from "@/components/providers/user";
import { Inter, Space_Mono } from "next/font/google";

import "./global.css";

// Font
const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Huzzle AI Interview demo",
  description: "Huzzle Video AI Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable}`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
