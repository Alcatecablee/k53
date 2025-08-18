import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onToggle, onClose }: MobileNavigationProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus first link when menu opens
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
    { to: '/practice', label: 'Practice', description: 'Practice assessments' },
    { to: '/progress', label: 'Results', description: 'View progress and results' },
    { to: '/pricing', label: 'Premium', description: 'Premium access options' },
    { to: '/dltc', label: 'Centers', description: 'Find testing centers' },
    { to: '/docs', label: 'Docs', description: 'Platform documentation' },
    { to: '/admin', label: 'Admin', description: 'Admin panel' },
    { 
      to: 'https://taxfy.co.za', 
      label: 'Tax', 
      description: 'Tax services portal',
      external: true 
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
        onClick={onToggle}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-haspopup="true"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 ease-in-out"
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-800 border-l border-black z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">
            Navigation
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col p-4 space-y-2" role="navigation" aria-label="Mobile navigation">
          {navigationItems.map((item, index) => {
            const isFirst = index === 0;
            const commonProps = {
              className: "flex flex-col p-4 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 focus:bg-slate-700",
              onClick: onClose,
              'aria-label': item.description,
              ref: isFirst ? firstLinkRef : undefined,
            };

            if (item.external) {
              return (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...commonProps}
                >
                  <span className="text-sm font-medium uppercase tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {item.description}
                  </span>
                </a>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                {...commonProps}
              >
                <span className="text-sm font-medium uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Official K53 Portal
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Department of Transport
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 