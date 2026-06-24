'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/layout';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-surface-border bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/dashboard">Apps</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <NavLink href="/about">About</NavLink>
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <>
                <NavLink href="/upload">Upload</NavLink>
                <NavLink href="/admin">Admin</NavLink>
              </>
            )}
            {user && (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-surface-border">
                <span className="text-sm text-gray-400">{user.username}</span>
                {user.role === 'superadmin' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">SUPER</span>
                )}
                <button onClick={logout} className="btn-secondary text-sm py-1.5 px-3">
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-border"
          >
            <div className="px-4 py-4 space-y-2">
              <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/dashboard" onClick={() => setMenuOpen(false)}>Apps</MobileNavLink>
              <MobileNavLink href="/docs" onClick={() => setMenuOpen(false)}>Docs</MobileNavLink>
              <MobileNavLink href="/about" onClick={() => setMenuOpen(false)}>About</MobileNavLink>
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <>
                  <MobileNavLink href="/upload" onClick={() => setMenuOpen(false)}>Upload</MobileNavLink>
                  <MobileNavLink href="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileNavLink>
                </>
              )}
              {user ? (
                <div className="pt-2 border-t border-surface-border mt-3">
                  <p className="text-sm text-gray-400 mb-2">Signed in as <span className="text-white">{user.username}</span></p>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full btn-secondary text-sm py-2">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-sm text-gray-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
    >
      {children}
    </Link>
  );
}
