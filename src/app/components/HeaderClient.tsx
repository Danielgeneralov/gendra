"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

export function HeaderClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isQuoteDropdownOpen, setIsQuoteDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsQuoteDropdownOpen(false);
      }
      
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsQuoteDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
          
          {/* Desktop Navigation */}
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
                      className="block px-4 py-3 text-sm font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 border-l-4 border-blue-500"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      <div className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-2 text-blue-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        AI Quote Parser
                      </div>
                    </Link>
                    
                    <div className="mt-2 pt-2 pb-1 border-t border-gray-200">
                      <p className="px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Industries</p>
                    </div>
                    
                    <Link 
                      href="/quote/metal-fabrication" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      Metal Fabrication
                    </Link>
                    <Link 
                      href="/quote/injection-molding" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      Injection Molding
                    </Link>
                    <Link 
                      href="/quote/cnc-machining" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      CNC Machining
                    </Link>
                    <Link 
                      href="/quote/sheet-metal" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      Sheet Metal
                    </Link>
                    <Link 
                      href="/quote/electronics-assembly" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsQuoteDropdownOpen(false)}
                    >
                      Electronics Assembly
                    </Link>
                  </div>
                )}
              </div>
              
              <NavLink href="/schedule" isScrolled={isScrolled}>Schedule</NavLink>
              <NavLink href="/dashboard" isScrolled={isScrolled}>Dashboard</NavLink>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? 'text-slate-200 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-y-0 right-0 w-3/4 max-w-xs bg-slate-900/95 backdrop-blur-md shadow-xl transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={closeMobileMenu}
              className="p-2 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg"
              aria-label="Close mobile menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-4 py-6 flex flex-col gap-4">
            <MobileNavLink href="/" onClick={closeMobileMenu}>Home</MobileNavLink>
            <MobileNavLink href="/quote" onClick={closeMobileMenu}>Quote</MobileNavLink>
            
            {/* Mobile Industry Links (simplified) */}
            <div className="ml-4 pl-4 border-l border-slate-700/50 flex flex-col gap-3">
              <MobileNavLink 
                href="/quote/metal-fabrication" 
                onClick={closeMobileMenu}
                className="text-base"
              >
                Metal Fabrication
              </MobileNavLink>
              <MobileNavLink 
                href="/quote/injection-molding" 
                onClick={closeMobileMenu}
                className="text-base"
              >
                Injection Molding
              </MobileNavLink>
              <MobileNavLink 
                href="/quote/cnc-machining" 
                onClick={closeMobileMenu}
                className="text-base"
              >
                CNC Machining
              </MobileNavLink>
              <MobileNavLink 
                href="/quote/sheet-metal" 
                onClick={closeMobileMenu}
                className="text-base"
              >
                Sheet Metal
              </MobileNavLink>
              <MobileNavLink 
                href="/quote/electronics-assembly" 
                onClick={closeMobileMenu}
                className="text-base"
              >
                Electronics Assembly
              </MobileNavLink>
            </div>
            
            <MobileNavLink href="/schedule" onClick={closeMobileMenu}>Schedule</MobileNavLink>
            <MobileNavLink href="/dashboard" onClick={closeMobileMenu}>Dashboard</MobileNavLink>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
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

function MobileNavLink({ 
  href, 
  children, 
  onClick,
  className = ""
}: { 
  href: string; 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`min-h-[48px] px-4 py-2 flex items-center text-lg font-medium text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );
} 