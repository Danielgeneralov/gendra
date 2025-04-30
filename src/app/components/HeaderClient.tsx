"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export function HeaderClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isQuoteDropdownOpen, setIsQuoteDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsQuoteDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
              
              {/* Quote Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsQuoteDropdownOpen(!isQuoteDropdownOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                    isScrolled
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  Quote
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transition-transform ${isQuoteDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isQuoteDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link 
                      href="/quote" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      All Industries
                    </Link>
                    <Link 
                      href="/quote?industry=metal_fabrication" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      Metal Fabrication
                    </Link>
                    <Link 
                      href="/quote?industry=injection_molding" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      Injection Molding
                    </Link>
                  </div>
                )}
              </div>
              
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