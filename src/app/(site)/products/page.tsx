import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { getPublishedProducts } from '@/server/queries/content';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Products',
    description:
      'Catalogue items from the Why Not Buy It Shop and Refurbished Goods divisions.',
    alternates: { canonical: '/products' },
  };
}

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <>
      <PageHero
        index="03"
        overline="Products"
        title={
          <>
            Good things,
            <br />
            <span className="text-sand italic">honestly priced.</span>
          </>
        }
        lede="Catalogue items from Why Not Buy It Shop and Refurbished Goods. Browse what is available, then get in touch to arrange collection."
        aside={
          <p className="text-sm leading-relaxed text-stone">
            There is no online checkout — orders are arranged by phone or email so
            we can confirm availability with you.
          </p>
        }
      />

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          {products.length === 0 ? (
            <>
              <Reveal>
                <SectionLabel index="A">Catalogue</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-10 max-w-2xl leading-relaxed text-stone">
                  Nothing is listed right now. Stock is added as it is refurbished
                  and catalogued — call us if you are looking for something
                  specific.
                </p>
              </Reveal>
            </>
          ) : (
            <>
              <Reveal>
                <SectionLabel index="A">{products.length} available</SectionLabel>
              </Reveal>

              <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <RevealItem key={product.id} distance={18}>
                    <div className="group h-full border border-line transition-colors duration-300 hover:border-sand/40">
                      {product.imageUrl ? (
                        <div className="aspect-4/3 overflow-hidden border-b border-line">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.imageUrl}
                            alt={product.shortDescription ?? product.name}
                            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-105"
                            loading={i < 3 ? 'eager' : 'lazy'}
                          />
                        </div>
                      ) : (
                        <div
                          aria-hidden
                          className="grain grid aspect-4/3 place-items-center border-b border-line bg-surface font-display text-4xl text-sand/70"
                        >
                          {product.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex h-full flex-col p-6">
                        <h2 className="font-display text-xl text-ivory">{product.name}</h2>
                        {product.shortDescription && (
                          <p className="lines-3 mt-3 text-sm leading-relaxed text-stone">
                            {product.shortDescription}
                          </p>
                        )}
                        <div className="mt-auto flex items-baseline justify-between gap-4 pt-6">
                          {typeof product.price === 'number' ? (
                            <span className="font-display text-2xl text-sand tabular-nums">
                              ${product.price}
                            </span>
                          ) : (
                            <span className="overline text-[9px] text-stone">Price on request</span>
                          )}
                          {!product.inStock && (
                            <span className="overline text-[9px] text-stone">Sold</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </>
          )}

          <Reveal delay={0.1}>
            <div className="mt-16 border-t border-line pt-10">
              <Cta href="/contact">Ask about an item</Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}