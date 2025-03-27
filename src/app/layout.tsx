import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FactoryFlow",
  description: "Modern factory management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-slate-900/95 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-white font-medium text-xl">
                  FactoryFlow
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  {[
                    { name: "Quote", href: "/quote" },
                    { name: "Schedule", href: "/schedule" },
                    { name: "Dashboard", href: "/dashboard" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200 ease-in-out"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

