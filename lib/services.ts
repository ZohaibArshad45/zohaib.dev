export type Service = {
  id: string;
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  items: string[];
  bestFor: string;
  stack: string;
  timeline?: string;
  startingPrice?: string;
  cta: string;
  href: string;
  featured?: boolean;
};

// No hardcoded demo services - all service data comes strictly from the database / CMS
export const INITIAL_SERVICES: Service[] = [];
