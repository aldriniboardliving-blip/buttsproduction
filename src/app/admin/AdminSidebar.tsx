'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { SessionContext } from '@/lib/auth/service';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'grid' },
  { href: '/admin/businesses', label: 'Businesses', icon: 'building' },
  { href: '/admin/services', label: 'Services', icon: 'briefcase' },
  { href: '/admin/products', label: 'Products', icon: 'tag' },
  { href: '/admin/events', label: 'Events', icon: 'calendar' },
  { href: '/admin/media', label: 'Media', icon: 'image' },
  { href: '/admin/faqs', label: 'FAQs', icon: 'question' },
  { href: '/admin/team', label: 'Team', icon: 'users' },
  { href: '/admin/settings', label: 'Settings', icon: 'cog' },
];

const iconPaths: Record<string, React.ReactNode> = {
  grid: (
    <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
  ),
  building: (
    <path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16h4v2H2v-2h2zm4-14v2h2V7H8zm0 4v2h2v-2H8zm0 4v2h2v-2H8zm4-8v2h2V7h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2z" />
  ),
  briefcase: (
    <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2h4a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h4zm2-2h2v2h-2V4z" />
  ),
  clipboard: (
    <path d="M9 2a1 1 0 00-1 1v1H6a2 2 0 00-2 2v13a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H9zm0 2h6v1H9V4zM7 9h10v2H7V9zm0 4h7v2H7v-2z" />
  ),
  document: (
    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z" />
  ),
  image: (
    <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h16v12H4V6zm3 2a2 2 0 100 4 2 2 0 000-4zm-1 9l3-4 2 3 3-4 3 5H6z" />
  ),
  calendar: (
    <path d="M7 2v2H4a2 2 0 00-2 2v13a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-3V2h-2v2H9V2H7zm13 7v10H4V9h16z" />
  ),
  question: (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2v-2zm1-9a3 3 0 013 3c0 1.5-1 2-1.5 2.5-.3.3-.5.5-.5 1.5h-2c0-1.5.5-2 1-2.5.3-.3.7-.8.7-1.5a1 1 0 00-2 0H9a3 3 0 013-3z" />
  ),
  tag: (
    <path d="M20.6 13.4L12 22l-9-9V3h10l7.6 7.6a2 2 0 010 2.8zM7.5 8A1.5 1.5 0 1 0 7.5 5a1.5 1.5 0 000 3z" />
  ),
  users: (
    <path d="M16 11a4 4 0 100-8 4 4 0 000 8zm-8 0a4 4 0 100-8 4 4 0 000 8zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5zm8 0c-.6 0-1.3.1-1.9.2 1.6 1.1 2.9 2.6 3.4 4.3.4-.9.5-1.9.5-2.9 0-1.5-1-1.6-2-1.6z" />
  ),
  cog: (
    <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4l-2 1.5.2 2.5-2.4.8-1 2.2-2.5-.3L12 21l-1.3-2.2-2.5.3-1-2.2-2.4-.8.2-2.5L3 12l2-1.5-.2-2.5 2.4-.8 1-2.2 2.5.3L12 3l1.3 2.2 2.5-.3 1 2.2 2.4.8-.2 2.5L21 12z" />
  ),
};

export function AdminSidebar({ session }: { session: SessionContext }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-300 flex flex-col shrink-0">
      <div className="p-6 border-b border-neutral-800">
        <Link href="/admin" className="text-lg font-semibold text-white">
          Butts Productions
        </Link>
        <p className="text-xs text-neutral-500 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50',
              )}
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                {iconPaths[item.icon]}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-500">
          Logged in as {session.email}
        </p>
      </div>
    </aside>
  );
}
