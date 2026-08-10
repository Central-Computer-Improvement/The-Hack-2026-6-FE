
// file : src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "AuraLearn",
  description: "AI Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}