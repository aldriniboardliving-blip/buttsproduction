import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicDivision } from '@/server/queries/divisions';
import { DivisionDetail } from '@/components/public/DivisionDetail';

export const instant = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const division = await getPublicDivision(slug);

  if (!division) return { title: 'Business not found' };

  return {
    title: division.name,
    description: division.shortDescription,
    alternates: { canonical: `/businesses/${division.slug}` },
    openGraph: {
      title: division.name,
      description: division.shortDescription,
      url: `/businesses/${division.slug}`,
    },
  };
}

export default async function BusinessPage({ params }: Params) {
  const { slug } = await params;
  const division = await getPublicDivision(slug);

  if (!division) notFound();

  return <DivisionDetail division={division} context="businesses" />;
}