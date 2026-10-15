import type { Metadata } from 'next';
import { PageHero } from './PageHero';
import { Reveal } from '@/components/motion/Reveal';

export type LegalSection = { heading: string; paragraphs: string[]; list?: string[] };

/** Shared layout for the policy documents so they read as one set. */
export function LegalDocument({
  index,
  overline,
  title,
  lede,
  updated,
  sections,
}: {
  index: string;
  overline: string;
  title: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero index={index} overline={overline} title={title} lede={lede} />

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Sticky contents */}
            <nav aria-label="Contents" className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="overline text-stone">Contents</p>
                <ol className="mt-6 space-y-3">
                  {sections.map((section, i) => (
                    <li key={section.heading} className="flex gap-3 text-sm">
                      <span className="text-stone tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <a
                        href={`#${slugify(section.heading)}`}
                        className="inline-block py-1 text-ivory/75 transition-colors duration-200 hover:text-sand"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
                <p className="overline mt-8 text-stone">Last updated</p>
                <p className="mt-2 text-sm text-ivory">{updated}</p>
              </div>
            </nav>

            {/* Body */}
            <div className="lg:col-span-8 lg:col-start-5">
              {sections.map((section, i) => (
                <Reveal key={section.heading} delay={0.03 * i}>
                  <section id={slugify(section.heading)} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
                    <h2 className="font-display text-display-md text-ivory">
                      <span className="mr-3 text-stone tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {section.heading}
                    </h2>

                    <div className="mt-6 space-y-5">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="leading-relaxed text-stone">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {section.list && (
                      <ul className="mt-6 space-y-3">
                        {section.list.map((item) => (
                          <li key={item} className="flex gap-3 leading-relaxed text-stone">
                            <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-sand" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function legalMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path } };
}