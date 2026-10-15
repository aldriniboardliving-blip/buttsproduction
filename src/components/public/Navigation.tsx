'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { divisions } from '@/lib/divisions';
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion';

export type NavItem = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string }>;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    children: [
      { label: 'All Services', href: '/services' },
      ...divisions.map((d) => ({ label: d.name, href: `/services/${d.slug}` })),
    ],
  },
  {
    label: 'Businesses',
    children: [
      { label: 'All Businesses', href: '/businesses' },
      ...divisions.map((d) => ({ label: d.name, href: `/businesses/${d.slug}` })),
    ],
  },
  { label: 'Quote', href: '/quote' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

const chevron = 'h-3 w-3 transition-transform duration-200';

/** Desktop navigation. Rendered once, in the header. */
export function Navigation() {
  const pathname = usePathname();
  // Open state is keyed to the path it was opened on, so a navigation closes
  // the menu by derivation rather than a cascading setState in an effect.
  const [openAt, setOpenAt] = useState<{ index: number; path: string } | null>(null);
  const open = openAt?.path === pathname ? openAt.index : null;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setOpen(index: number | null) {
    setOpenAt(index === null ? null : { index, path: pathname });
  }

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }

  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {navItems.map((item, i) => {
        if (!item.children) {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href!}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'link-underline px-4 py-2 text-sm transition-colors duration-200',
                  active ? 'text-sand' : 'text-ivory/80 hover:text-ivory',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        }

        const isOpen = open === i;
        const groupActive = item.children.some((c) => pathname === c.href);

        return (
          <li
            key={item.label}
            className="relative"
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setOpen(i);
            }}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="true"
              onClick={() => setOpen(isOpen ? null : i)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(null);
              }}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-sm transition-colors duration-200',
                groupActive || isOpen ? 'text-sand' : 'text-ivory/80 hover:text-ivory',
              )}
            >
              {item.label}
              <svg aria-hidden viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className={cn(chevron, isOpen && 'rotate-180')}>
                <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: DURATION.micro, ease: EASE_OUT_EXPO }}
                  className="absolute left-0 top-full z-50 w-[19rem] pt-3"
                >
                  <div className="grain border border-line bg-ink/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center justify-between gap-3 px-3 py-2.5 text-sm transition-colors duration-150',
                            active
                              ? 'bg-primary-600/25 text-sand'
                              : 'text-ivory/75 hover:bg-primary-600/15 hover:text-ivory',
                          )}
                        >
                          <span className="leading-snug">{child.label}</span>
                          {active && <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-sand" />}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

/** Mobile accordion. Rendered only inside the mobile panel. */
export function MobileNavigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<{ index: number; path: string } | null>(null);
  const open = openAt?.path === pathname ? openAt.index : null;

  return (
    <ul className="divide-y divide-line">
      {navItems.map((item, i) => {
        if (!item.children) {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href!}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between py-4 font-display text-2xl tracking-tight transition-colors',
                  active ? 'text-sand' : 'text-ivory',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        }

        const isOpen = open === i;
        const groupActive = item.children.some((c) => pathname === c.href);

        return (
          <li key={item.label} className="py-1">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() =>
                setOpenAt(isOpen ? null : { index: i, path: pathname })
              }
              className={cn(
                'flex w-full items-center justify-between py-4 text-left font-display text-2xl tracking-tight transition-colors',
                groupActive ? 'text-sand' : 'text-ivory',
              )}
            >
              {item.label}
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-sand transition-transform duration-300',
                  isOpen && 'rotate-180',
                )}
              >
                <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1 pb-4 pl-1">
                    {item.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onNavigate}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'block py-2 text-sm transition-colors',
                              active ? 'text-sand' : 'text-ivory/65 hover:text-ivory',
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}