export interface Division {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price?: number;
  duration?: string;
  highlights: string[];
  quotePath?: string;
}

export const divisions: Division[] = [
  {
    slug: 'keeping-it-kleen',
    name: 'Keeping it Kleen Janitorial Services',
    shortDescription: 'Keep it spotless with our expert cleaners',
    description:
      'At Keeping it Kleen, you are top priority! We take pride in our work in every way with every facility we clean. In our 15+ years of service, we have gained knowledge of the many ins and outs to serving our clients properly. Therefore, you can ALWAYS count on the Kleen Team to get the job done.',
    price: 100,
    duration: '1 hr',
    highlights: [
      'Over 15 years of professional cleaning experience',
      'Commercial and residential facility cleaning',
      'Trained, background-checked cleaning staff',
      'Our motto: "We Strive for Excellence and Wipe Away Imperfections!"',
    ],
    quotePath: '/quote',
  },
  {
    slug: 'kleen-prints-ink',
    name: 'Kleen Prints Ink',
    shortDescription: 'Custom printing, design, and virtual consultation',
    description:
      'Kleen Prints Ink delivers polished, professional design and print work for businesses and events. From business cards and flyers to banners, signage, and custom apparel, our design director works with you to craft materials that represent your brand the way you want to be seen.',
    price: 50,
    duration: '1 hr',
    highlights: [
      'Business cards, flyers, and brochures',
      'Banners, signs, and promotional items',
      'Custom apparel and branded merchandise',
      'Virtual design consultation sessions',
    ],
    quotePath: '/quote/custom-print',
  },
  {
    slug: 'butts-consulting',
    name: 'Butts Consulting',
    shortDescription: 'Preparing you and your next big business venture',
    description:
      'Butts Productions Consulting offers creative consulting services that help businesses enhance their brand and content. We specialize in creative strategy, media production, and brand development, working with clients to craft impactful campaigns and polished content.',
    price: 145,
    duration: '2 hr',
    highlights: [
      'Creative strategy and brand development',
      'Video production and digital marketing',
      'Event planning and digital transformation advice',
      'Training workshops for growing businesses',
    ],
    quotePath: '/quote/coaching',
  },
  {
    slug: 'dispatching',
    name: 'Dispatching',
    shortDescription: '"We dispatch. You Drive!"',
    description:
      'Our dispatching service connects independent truckers and small fleet owners with loads that need moving. We handle the logistics and paperwork so you can stay focused on the road and the work that pays.',
    price: 100,
    highlights: [
      'Load matching for independent truckers',
      'Small fleet support and logistics coordination',
      '24/7 dispatch availability',
      'Competitive rates with straightforward paperwork',
    ],
    quotePath: '/quote/dispatch',
  },
  {
    slug: 'sweet-tender-loving-care',
    name: 'Sweet Tender Loving Care',
    shortDescription: 'Compassionate care services',
    description:
      'Sweet Tender Loving Care provides compassionate, dependable support for those who need a helping hand. Our approach is rooted in dignity, patience, and the belief that care should feel personal.',
    highlights: [
      'Companionship and daily support',
      'Personal care assistance',
      'Family and caregiver coordination',
      'Flexible scheduling options',
    ],
  },
  {
    slug: 'car-rentals',
    name: 'Butts Car Rentals',
    shortDescription: 'Ride in comfort with our reliable rentals',
    description:
      'Butts Productions now offers car rental services, providing customers with a cost-effective and convenient way to rent vehicles. By teaming up with Turo, a leading peer-to-peer car rental platform, we are able to offer a wide range of vehicles at competitive prices while maintaining profitability.',
    price: 70,
    duration: '1 day',
    highlights: [
      'Four well-maintained vehicles available',
      '150 miles per day included, unlimited available',
      '$100 refundable deposit returned on return',
      'Drivers 21+ with a valid license and major credit card',
    ],
    quotePath: '/quote/car-rental',
  },
  {
    slug: 'the-giving-backpack-foundation',
    name: 'The Giving BackPack Foundation',
    shortDescription: 'Community outreach and support initiatives',
    description:
      'The Giving BackPack Foundation is proud to launch our "Make the Change" Campaign, a community effort to raise spare change that will fund a Laundry Day for the Homeless in our local community. Every coin counts. The change sitting in your car, your pockets, or your home can help provide something!',
    highlights: [
      'Community-led fundraising campaigns',
      'Supporting the homeless in Norfolk, VA',
      'Volunteer-driven initiatives and events',
      'Open to partners who want to make a difference',
    ],
  },
  {
    slug: 'kleen-team-entertainment',
    name: 'Kleen Team Entertainment',
    shortDescription: 'Book a DJ, or rent tents for your next event',
    description:
      'Kleen Team Entertainment brings the energy to your event. DJ PHARFETCHED spins the set while our team provides tents and event equipment, so you can focus on your guests while we handle the details.',
    price: 300,
    duration: '2 hr',
    highlights: [
      'DJ services by DJ PHARFETCHED',
      'Tent rentals for any occasion',
      'Sound systems and lighting',
      'Custom packages for weddings, parties, and corporate events',
    ],
    quotePath: '/quote/entertainment',
  },
  {
    slug: 'why-not-buy-it-shop',
    name: 'Why Not Buy It Shop',
    shortDescription: 'Quality products at great prices',
    description:
      'Why Not Buy It Shop is our retail space for quality goods at prices that make sense. We source practical, well-made products and pass the savings straight to our customers.',
    highlights: [
      'Curated selection of quality goods',
      'Straightforward, honest pricing',
      'Refurbished and like-new options',
      'Community-focused retail',
    ],
  },
  {
    slug: 'keeping-it-real-psych',
    name: 'Keeping It Real Psych',
    shortDescription: 'Mental health and wellness support',
    description:
      'Keeping It Real Psych provides grounded mental health and wellness support. We believe in real conversations, practical strategies, and meeting people exactly where they are.',
    highlights: [
      'Mental health and wellness support',
      'Practical, real-world strategies',
      'Confidential and judgement-free',
      'In-person and virtual sessions',
    ],
  },
  {
    slug: 'refurbished-goods',
    name: 'Refurbished Goods',
    shortDescription: 'Restored and refurbished items',
    description:
      'Our refurbished goods division restores items so they are ready for a second life. Every piece is carefully assessed and renewed, giving quality goods another chapter instead of a landfill.',
    highlights: [
      'Carefully assessed and restored items',
      'Quality checked before resale',
      'Sustainable alternative to buying new',
      'Managed by our Refurbished Goods team',
    ],
  },
];

export function getDivision(slug: string): Division | undefined {
  return divisions.find((division) => division.slug === slug);
}