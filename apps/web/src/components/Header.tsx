"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#focus", label: "Focus" },
  { href: "#assistant", label: "Assistant" },
  { href: "#security", label: "Security" },
  { href: "#pricing", label: "Pricing" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-[#0c0f0e]/90 backdrop-blur-xl border-b border-outline-variant/50 shadow-lg shadow-black/20"
          : "bg-[#0c0f0e]/75 backdrop-blur-md border-b border-outline-variant/30"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="#"
          onClick={closeMenu}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
        >
          <Image
            src="/images/seekpro_logo.png"
            alt="SeekPro Logo"
            width={28}
            height={28}
            priority
            className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-headline font-semibold text-base sm:text-lg tracking-tight text-on-surface">
            SeekPro
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] text-on-surface-variant font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors py-1 focus:outline-none"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop & Tablet Action CTA */}
        <div className="flex items-center gap-3">
          <a
            className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold tracking-wide hover:bg-secondary hover:text-[#002112] transition-all shadow-[0_0_20px_rgba(160,232,194,0.15)] active:scale-95"
            href="#request-access"
          >
            Request Access
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-surface-container border border-outline-variant/50 text-on-surface hover:text-primary transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/40 bg-[#0c0f0e]/95 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-5 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-outline-variant/30 mt-3">
              <a
                href="#request-access"
                onClick={closeMenu}
                className="w-full flex items-center justify-center py-3 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold tracking-wide hover:bg-secondary hover:text-[#002112] transition-all shadow-[0_0_20px_rgba(160,232,194,0.15)]"
              >
                Request Access
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

