export interface BentoFeatureItem {
  id: string;
  title: string;
  badge?: string;
  description: string;
  technicalDetails?: string;
  gridSpan: string; // Tailwind grid span classes like 'col-span-2 row-span-2'
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  ctaText: string;
  isPopular: boolean;
}

export interface TechPartner {
  name: string;
  monoLabel: string;
}
