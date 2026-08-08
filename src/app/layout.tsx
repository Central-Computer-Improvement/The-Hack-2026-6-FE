import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"], 
  variable: "--font-nunito-sans", 
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${nunitoSans.variable} font-sans bg-background text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}