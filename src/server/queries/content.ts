import 'server-only';

import { dbConnect } from '@/lib/db';
import { connection } from 'next/server';
import { FAQ } from '@/server/models/FAQ';
import { Product } from '@/server/models/Product';
import { TeamMember } from '@/server/models/TeamMember';

const PUBLISHED = { published: true, archivedAt: { $exists: false } } as const;

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export async function getPublishedFaqs(): Promise<PublicFaq[]> {
  await connection();
  try {
    await dbConnect();
    const docs = await FAQ.find(PUBLISHED)
      .select('question answer category')
      .sort({ displayOrder: 1, question: 1 })
      .lean();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      question: doc.question,
      answer: doc.answer,
      category: doc.category,
    }));
  } catch (error) {
    console.error('[faqs] failed to load public FAQs', error);
    return [];
  }
}

export interface PublicTeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
}

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  await connection();
  try {
    await dbConnect();
    const docs = await TeamMember.find(PUBLISHED)
      .populate('photo', 'secureUrl alt')
      .select('name role bio photo')
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    return docs.map((doc) => {
      const photo = doc.photo as { secureUrl?: string } | null | undefined;
      return {
        id: doc._id.toString(),
        name: doc.name,
        role: doc.role,
        bio: doc.bio,
        photoUrl: photo?.secureUrl,
      };
    });
  } catch (error) {
    console.error('[team] failed to load public team members', error);
    return [];
  }
}

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  currency: string;
  inStock: boolean;
  imageUrl?: string;
}

interface LeanProduct {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  currency: string;
  inStock: boolean;
  featuredImage?: { secureUrl?: string } | null;
}

function toPublicProduct(doc: LeanProduct): PublicProduct {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    description: doc.description,
    price: doc.price,
    currency: doc.currency,
    inStock: doc.inStock,
    imageUrl: doc.featuredImage?.secureUrl,
  };
}

export async function getPublishedProducts(limit?: number): Promise<PublicProduct[]> {
  await connection();
  try {
    await dbConnect();
    const docs = (await Product.find(PUBLISHED)
      .populate('featuredImage', 'secureUrl alt')
      .select('name slug shortDescription description price currency inStock featuredImage')
      .sort({ displayOrder: 1, name: 1 })
      .limit(limit ?? 100)
      .lean()) as unknown as LeanProduct[];

    return docs.map(toPublicProduct);
  } catch (error) {
    console.error('[products] failed to load public products', error);
    return [];
  }
}

export async function getPublishedProductBySlug(slug: string): Promise<PublicProduct | null> {
  await connection();
  try {
    await dbConnect();
    const docs = (await Product.find({ ...PUBLISHED, slug })
      .populate('featuredImage', 'secureUrl alt')
      .select('name slug shortDescription description price currency inStock featuredImage')
      .lean()) as unknown as LeanProduct[];

    return docs[0] ? toPublicProduct(docs[0]) : null;
  } catch (error) {
    console.error('[products] failed to load product', slug, error);
    return null;
  }
}