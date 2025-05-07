import type { Metadata } from "next";
import "./globals.css";
import { HeaderClient } from "./components/HeaderClient";

export const metadata: Metadata = {
  title: "Gendra",
  description: "AI-powered intelligence for modern manufacturing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <HeaderClient />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}



