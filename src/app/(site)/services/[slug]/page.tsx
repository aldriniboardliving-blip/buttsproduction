import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { divisions } from '@/lib/divisions';
import { DivisionDetail } from '@/components/public/DivisionDetail';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return divisions.map((division) => ({ slug: division.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const division = divisions.find((item) => item.slug === slug);

  if (!division) return { title: 'Service not found' };

  return {
    title: division.name,
    description: division.shortDescription,
    alternates: { canonical: `/services/${division.slug}` },
    openGraph: {
      title: division.name,
      description: division.shortDescription,
      url: `/services/${division.slug}`,
    },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const index = divisions.findIndex((item) => item.slug === slug);
  const division = divisions[index];

  if (!division) notFound();

  return <DivisionDetail division={division} index={index} context="services" />;
}