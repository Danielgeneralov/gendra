"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, AlignRight } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { usePathname } from "next/navigation";

export function HeaderClient() {
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isQuoteDropdownOpen, setIsQuoteDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { session, loading, supabase } = useAuth();

  // Check if the current page is protected
  const isProtectedRoute = pathname?.startsWith('/quote') || 
                          pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/schedule');

  // Only redirect to login if on a protected route and no session
  useEffect(() => {
    if (!loading && !session && isProtectedRoute && typeof window !== 'undefined') {
      window.location.href = `/signin?redirectedFrom=${encodeURIComponent(pathname)}`;
    }
  }, [loading, session, isProtectedRoute, pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsQuoteDropdownOpen(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }

      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsQuoteDropdownOpen(false);
        setIsAccountMenuOpen(false);
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

  // Effect to close mobile menu on scroll
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    
    let lastScrollY = window.scrollY;
    const scrollThreshold = 20;
    let isThrottled = false;
    
    const handleScroll = () => {
      if (isThrottled) return;
      
      const currentScrollY = window.scrollY;
      const scrollDistance = Math.abs(currentScrollY - lastScrollY);
      
      if (scrollDistance > scrollThreshold) {
        closeMobileMenu();
      }
      
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
        lastScrollY = window.scrollY;
      }, 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAccountMenuOpen(false);
  };

  if (loading) return null;

  // Determine active link for highlighting
  const isActive = (path: string) => pathname === path;

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-slate-800/50' 
          : 'bg-[#0f1119]/90 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className="h-16 flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-medium tracking-tight text-white transition-colors duration-300"
            >
              Gendra
            </Link>
          </div>
          
          {/* Center Section - Navigation Links */}
          <div className="hidden md:flex items-center justify-center ml-auto mr-auto">
            {session ? (
              /* Authenticated Navigation Links */
              <div className="flex items-center space-x-6">
                <NavLink href="/" isActive={isActive('/')}>Home</NavLink>
                
                {/* Quote Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsQuoteDropdownOpen(!isQuoteDropdownOpen)}
                    className={`group px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center
                      ${isActive('/quote') 
                        ? 'text-white' 
                        : 'text-slate-300 hover:text-white'}
                    `}
                  >
                    <span className="relative">
                      Quote
                      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-200 ${isActive('/quote') ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transition-transform duration-200 ${isQuoteDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isQuoteDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 py-2 bg-slate-800 rounded-md shadow-lg ring-1 ring-slate-700 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link 
                        href="/quote" 
                        className="block px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-700 border-l-2 border-blue-500"
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
                      
                      <div className="mt-2 pt-2 pb-1 border-t border-slate-700">
                        <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Industries</p>
                      </div>
                      
                      <Link 
                        href="/quote/metal-fabrication" 
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        onClick={() => setIsQuoteDropdownOpen(false)}
                      >
                        Metal Fabrication
                      </Link>
                      <Link 
                        href="/quote/injection-molding" 
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        onClick={() => setIsQuoteDropdownOpen(false)}
                      >
                        Injection Molding
                      </Link>
                      <Link 
                        href="/quote/cnc-machining" 
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        onClick={() => setIsQuoteDropdownOpen(false)}
                      >
                        CNC Machining
                      </Link>
                      <Link 
                        href="/quote/sheet-metal" 
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        onClick={() => setIsQuoteDropdownOpen(false)}
                      >
                        Sheet Metal
                      </Link>
                      <Link 
                        href="/quote/electronics-assembly" 
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                        onClick={() => setIsQuoteDropdownOpen(false)}
                      >
                        Electronics Assembly
                      </Link>
                    </div>
                  )}
                </div>
                
                <NavLink href="/schedule" isActive={isActive('/schedule')}>Schedule</NavLink>
                <NavLink href="/dashboard" isActive={isActive('/dashboard')}>Dashboard</NavLink>
              </div>
            ) : (
              /* Public Navigation Links */
              <div className="flex items-center space-x-6">
                <NavLink href="/" isActive={isActive('/')}>Home</NavLink>
                <NavLink href="/products" isActive={isActive('/products')}>Products</NavLink>
                <NavLink href="/pricing" isActive={isActive('/pricing')}>Pricing</NavLink>
                <NavLink href="/faq" isActive={isActive('/faq')}>FAQ</NavLink>
              </div>
            )}
          </div>
          
          {/* Right Section - Auth or Account */}
          <div className="flex items-center">
            {session ? (
              /* Authenticated - Account Menu */
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-2 rounded-md transition-all duration-200 text-slate-300 hover:text-white hover:bg-slate-800/50 focus:ring-2 focus:ring-slate-700 focus:outline-none"
                  aria-label="Account menu"
                >
                  <AlignRight className="h-5 w-5" />
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-slate-800 rounded-md shadow-lg ring-1 ring-slate-700 focus:outline-none origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      href="/account/preferences" 
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Preferences
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public - Login/Signup Buttons */
              <div className="flex items-center space-x-3">
                <Link 
                  href="/signin" 
                  className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button - Only Visible on Mobile */}
          <div className="ml-4 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-y-0 right-0 w-3/4 max-w-xs shadow-xl transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
        style={{ 
          backgroundColor: 'rgba(15, 17, 25, 0.98)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 1px 0 0 0 rgba(255, 255, 255, 0.05), -10px 0 30px rgba(0, 0, 0, 0.5)'
        }}
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={closeMobileMenu}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
              aria-label="Close mobile menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 py-6 flex flex-col gap-4">
            {session ? (
              /* Mobile Authenticated Menu */
              <>
                <MobileNavLink href="/" onClick={closeMobileMenu}>Home</MobileNavLink>
                <MobileNavLink href="/quote" onClick={closeMobileMenu}>Quote</MobileNavLink>
                
                {/* Mobile Industry Links */}
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
                <MobileNavLink href="/account/preferences" onClick={closeMobileMenu}>Preferences</MobileNavLink>
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMobileMenu();
                  }}
                  className="min-h-[48px] px-4 py-2 flex items-center text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              /* Mobile Public Menu */
              <>
                <MobileNavLink href="/" onClick={closeMobileMenu}>Home</MobileNavLink>
                <MobileNavLink href="/products" onClick={closeMobileMenu}>Products</MobileNavLink>
                <MobileNavLink href="/pricing" onClick={closeMobileMenu}>Pricing</MobileNavLink>
                <MobileNavLink href="/faq" onClick={closeMobileMenu}>FAQ</MobileNavLink>
                <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col gap-3">
                  <MobileNavLink 
                    href="/signin" 
                    onClick={closeMobileMenu}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Log In
                  </MobileNavLink>
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="min-h-[48px] px-4 py-2 flex items-center justify-center text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#0f1119]/80 z-40 backdrop-blur-md transition-opacity duration-300"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

function NavLink({ 
  href, 
  children, 
  isActive,
  className = ""
}: { 
  href: string; 
  children: React.ReactNode; 
  isActive: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`
        group px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
        ${isActive 
          ? 'text-white' 
          : 'text-slate-300 hover:text-white'
        } ${className}
      `}
    >
      <span className="relative">
        {children}
        <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-200 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
      </span>
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
      className={`min-h-[48px] px-4 py-2 flex items-center text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );
} 