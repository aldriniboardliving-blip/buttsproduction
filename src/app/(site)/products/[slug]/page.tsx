import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedProductBySlug } from '@/server/queries/content';
import { PageHero } from '@/components/public/PageHero';
import { Cta } from '@/components/public/Cta';
import { Reveal } from '@/components/motion/Reveal';

export const instant = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    description: product.shortDescription ?? product.description?.slice(0, 160),
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <PageHero
        index="03"
        overline={product.inStock ? 'In stock' : 'Sold'}
        title={product.name}
        lede={product.shortDescription}
        aside={
          typeof product.price === 'number' ? (
            <p>
              <span className="overline text-stone">Price</span>
              <span className="mt-4 block font-display text-6xl leading-none text-sand tabular-nums">
                ${product.price}
              </span>
            </p>
          ) : undefined
        }
      />

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-lg leading-relaxed text-stone">{product.description}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Cta href="/contact">Enquire about this item</Cta>
                <Cta href="/products" variant="outline">
                  All products
                </Cta>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}