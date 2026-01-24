'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#resorts', label: 'الشاليهات' },
    { href: '/policy', label: 'القوانين والشروط' },
    { href: '/#contact', label: 'تواصل معنا' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 font-sans font-medium text-lg bg-black transition-all duration-300',
        isScrolled
          ? 'bg-white/80 shadow-xl font-sans font-normal letter-spacing-[0.05em] tracking-wider'
          : 'bg-transparent'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-sans border-4 border-white rounded-full px-7 py-2 bg-clip-text text-white font-bold"
          >
          
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-bold transition-colors font-sans hover:underline py-1 px-2 backdrop-blur-sm rounded-full hover:text-amber-300 letter-spacing-[0.05em] tracking-wider ',
                  isScrolled ? 'text-gray-600' : 'text-gray-100',
                  'style={{ WebkitTextStroke: "2px #161616ff" }}'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+973xxxxxxxx"
              className="btn btn-primary flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              احجز الآن
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              isScrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            )}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+973xxxxxxxx"
              className="btn btn-primary flex items-center justify-center gap-2 mt-2"
            >
              <Phone className="w-4 h-4" />
              احجز الآن
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
