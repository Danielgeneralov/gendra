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
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-slate-900 font-medium text-xl">
                  FactoryFlow
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-1">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                  >
                    Home
                  </Link>
                  <Link
                    href="/quote"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                  >
                    Quote
                  </Link>
                  <Link
                    href="/schedule"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                  >
                    Schedule
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

// PART 6 — Add a top navigation bar to layout.tsx
// - Use Tailwind CSS to create a clean, modern nav bar
// - Include links to: Home (/), Quote (/quote), Schedule (/schedule), Dashboard (/dashboard)
// - Style the links with hover effects and spacing
// - Make the nav stick to the top with a shadow and white background
// - Use next/link for routing
// - Wrap children content in a responsive container (max-w-4xl)
// - Stop after rendering the nav and layout shell
