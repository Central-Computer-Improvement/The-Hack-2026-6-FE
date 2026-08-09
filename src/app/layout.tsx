import "./globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

const jakarta = Nunito_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
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
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}