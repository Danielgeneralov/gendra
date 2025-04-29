"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function HeaderClient() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-slate-800/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className={`text-xl font-medium transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-slate-900'
              }`}
            >
              Gendra
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink href="/" isScrolled={isScrolled}>Home</NavLink>
              <NavLink href="/quote" isScrolled={isScrolled}>Quote</NavLink>
              <NavLink href="/schedule" isScrolled={isScrolled}>Schedule</NavLink>
              <NavLink href="/dashboard" isScrolled={isScrolled}>Dashboard</NavLink>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isScrolled
          ? 'text-slate-200 hover:text-white hover:bg-slate-800/50'
          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
      }`}
    >
      {children}
    </Link>
  );
} 