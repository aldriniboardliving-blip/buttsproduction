'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Navigation, MobileNavigation } from './Navigation';
import { Cta } from './Cta';
import { cn } from '@/lib/utils';
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion';

/** Typographic lockup. Stands in for a logo asset the project does not have,
 * and can be swapped for real artwork later without touching layout. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden
        className="grain grid h-9 w-9 shrink-0 place-items-center border border-line-strong bg-surface font-display text-[13px] leading-none tracking-tight text-sand"
        style={{ WebkitTextStroke: '0.4px currentColor' }}
      >
        BP
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] tracking-tight text-ivory">Butts</span>
        <span className="overline mt-1 text-[9px] text-stone">Productions</span>
      </span>
    </span>
  );
}

export function PublicHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 32);
  });

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-quint)]',
          scrolled || menuOpen
            ? 'border-b border-line bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-18 w-full max-w-[1536px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link href="/" aria-label="Butts Productions — home">
            <Wordmark />
          </Link>

          <Navigation />

          <div className="hidden items-center gap-4 lg:flex">
            <Cta href="/quote" variant="outline" className="px-5 py-2.5">
              Request a quote
            </Cta>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="-mr-2 grid h-11 w-11 place-items-center text-ivory transition-colors hover:text-sand lg:hidden"
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={cn(
                  'absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[var(--ease-out-quint)]',
                  menuOpen ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-1.5 block h-px w-full bg-current transition-opacity duration-200',
                  menuOpen && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[var(--ease-out-quint)]',
                  menuOpen ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.micro, ease: EASE_OUT_EXPO }}
            className="grain wash fixed inset-0 z-40 overflow-y-auto bg-ink pt-24 pb-12 lg:hidden"
          >
            <div className="mx-auto w-full max-w-[1536px] px-5 sm:px-8">
              <MobileNavigation onNavigate={() => setMenuOpen(false)} />

              <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8">
                <Cta href="/quote" className="justify-center">
                  Request a quote
                </Cta>
                <a
                  href="tel:+18664547033"
                  className="py-2 text-center text-sm text-stone transition-colors hover:text-sand"
                >
                  1-866-454-7033
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}