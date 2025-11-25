"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface HeaderProps {
  user?: {
    email: string;
    name: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-night-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-gold via-yellow-500 to-brand-gold bg-clip-text text-transparent">PPP</h1>
            <p className="text-xs text-slate-400">by Manaboodle</p>
          </div>
        </Link>

        {/* Right side: Hamburger menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-night-800 border border-white/10 rounded-lg shadow-xl py-2">
              {user && (
                <>
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  </div>
                </>
              )}
              
              <a
                href="https://www.manaboodle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
              >
                Manaboodle Home
              </a>
              
              <a
                href="https://www.manaboodle.com/academic-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
              >
                Academic Portal
              </a>
              
              {user ? (
                <a
                  href="/api/logout"
                  className="block px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                >
                  Log Out
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="block px-4 py-2 text-sm text-brand-gold hover:bg-white/5 transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="https://www.manaboodle.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Create Account
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
