import type { Metadata } from 'next';
import { QuoteDetail } from '@/components/public/QuoteDetail';

export const metadata: Metadata = {
  title: 'Car Rental Quote',
  description:
    'Rent a car from Butts Productions in Norfolk, VA. $70 per day, 150 miles included, $100 refundable deposit.',
  alternates: { canonical: '/quote/car-rental' },
};

const FLEET = [
  'Rosie — 2013 Ford Fusion',
  'Princess — 2016 Jeep Cherokee',
  'Scarlet — 2013 Nissan Rogue',
  'Pepper — 2013 GMC Terrain',
];

export default function CarRentalQuotePage() {
  return (
    <QuoteDetail
      index={1}
      service={{
        slug: 'car-rental',
        title: 'Car Rental',
        lede: 'Ride in comfort with our reliable rentals. Four well-maintained vehicles, straightforward rates, and a $100 refundable deposit returned to you on return.',
        price: '$70',
        unit: 'per day · 150 miles included',
        relatedSlug: 'car-rentals',
        includes: FLEET,
        terms: [
          {
            heading: 'Rental agreement',
            points: [
              'You must be at least twenty-one years of age to rent from Butts Productions Car Rental Services.',
              'A valid driver’s licence and a major credit card are required for booking and payment.',
              'All rentals are subject to availability. Prices and terms may change without notice.',
              'You are responsible for the vehicle during the rental period. Any damage, loss or theft is your responsibility unless you have purchased additional insurance.',
            ],
          },
          {
            heading: 'Key fees',
            points: [
              'A fee of $300 applies for lost or stolen keys.',
              'If you lock your keys in the vehicle, a $100 pop-a-lock service fee applies.',
            ],
          },
          {
            heading: 'Vehicle usage',
            points: [
              'The vehicle may only be used for lawful purposes and within the agreed geographical area.',
              'You may not sublease, rent, or allow any other person to drive the vehicle without prior approval.',
              'Smoking is prohibited in all rental vehicles.',
              'If pets are transported in the vehicle, a cleaning fee of $200 is charged to cover cleaning and sanitising.',
            ],
          },
          {
            heading: 'Battery, jump-start and safety policy',
            points: [
              'Jump-starting the vehicle is strictly prohibited for any reason.',
              'If the battery dies or becomes inoperable, contact Butts Productions headquarters or AAA roadside assistance.',
              'Personal performance measures — including jump-starting, attempting repairs, or using third-party assistance without authorisation — are not permitted.',
              'Violations may result in additional fees and/or termination of the rental agreement.',
            ],
          },
          {
            heading: 'Cancellation and modifications',
            points: [
              'You may modify or cancel your reservation up to twenty-four hours before the scheduled pick-up time without penalty.',
              'If you cancel within twenty-four hours of the scheduled pick-up time, no partial refund is issued. As a gesture of goodwill a ten per cent discount applies to your next rental booking.',
              'There is a fifteen-minute grace period after the scheduled pick-up time. If you are more than fifteen minutes late your reservation is cancelled and no refund is issued.',
              'Failure to pick up the vehicle, or cancelling after the scheduled pick-up time, results in no refund.',
            ],
          },
          {
            heading: 'Liability and governing law',
            points: [
              'Butts Productions Car Rental Services is not liable for any damages, losses or accidents that occur while using the vehicle. You agree to indemnify and hold us harmless from claims arising out of your use of the rental vehicle.',
              'These terms are governed by the laws of the State of North Carolina.',
            ],
          },
        ],
      }}
    />
  );
}