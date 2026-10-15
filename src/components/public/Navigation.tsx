'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationProps {
  navItems: Array<{
    label: string;
    href?: string;
    children?: Array<{ label: string; href: string }>;
  }>;
}

export function Navigation({ navItems }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="hidden md:flex md:items-center md:gap-8">
        {navItems.map((item) => (
          <NavItem key={item.href || item.label} item={item} currentPath={pathname} />
        ))}
      </div>

      <div className="md:hidden" id="mobile-menu" aria-hidden={!mobileMenuOpen}>
        <div className="py-4 space-y-1">
          {navItems.map((item) => (
            <MobileNavItem key={item.href || item.label} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

function NavItem({ item, currentPath }: { item: { label: string; href?: string; children?: Array<{ label: string; href: string }> }; currentPath: string }) {
  const href = item.href ?? '#';
  const isActive = currentPath === href || (href !== '#' && currentPath.startsWith(href));

  if (item.children) {
    return (
      <div className="relative group">
        <button
          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
            isActive ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'
          }`}
          aria-haspopup="true"
          aria-expanded="false"
        >
          {item.label}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute left-0 top-full mt-1 w-48 rounded-lg bg-white py-1 shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-2 text-sm transition-colors ${
                currentPath === child.href ? 'bg-primary-50 text-primary-600' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'
      }`}
    >
      {item.label}
    </Link>
  );
}

function MobileNavItem({ item }: { item: { label: string; href?: string; children?: Array<{ label: string; href: string }> } }) {
  if (item.children) {
    return (
      <div className="space-y-1 pl-4">
        <span className="block px-3 py-2 text-sm font-medium text-neutral-500">{item.label}</span>
        {item.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className="block px-3 py-2 text-sm transition-colors hover:bg-neutral-50"
          >
            {child.label}
          </Link>
        ))}
      </div>
    );
  }

  const href = item.href ?? '#';

  return (
    <Link
      href={href}
      className="block px-3 py-2 text-base font-medium transition-colors hover:bg-neutral-50"
    >
      {item.label}
    </Link>
  );
}