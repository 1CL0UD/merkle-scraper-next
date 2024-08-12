import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/findRelevantResult.ts
import { GoogleSearchResult } from '@/hooks/useLinkedinScrape';

export const findRelevantResult = (
  company: string,
  results: GoogleSearchResult[]
): GoogleSearchResult | null => {
  if (results.length === 0) return null;

  const companyWords = company.toLowerCase().split(/\s+/);

  // First, look for the company name in the domain
  const domainResult = results.find((result) => {
    const urlParts = new URL(result.url).hostname.split('.');
    return companyWords.some((word) =>
      urlParts.some((part) => part.toLowerCase().includes(word))
    );
  });

  if (domainResult) {
    return domainResult;
  }

  // If not found in domain, check for company name in the endpoint
  const endpointResult = results.find((result) => {
    const urlLower = result.url.toLowerCase();
    const endpoint = urlLower.split('/').pop() || '';
    return companyWords.some((word) => endpoint.includes(word));
  });

  // If found in endpoint and it's a LinkedIn URL, return it
  if (
    endpointResult &&
    endpointResult.url.toLowerCase().includes('linkedin.com/company/')
  ) {
    return endpointResult;
  }

  // If no match found, return the top result
  return results[0];
};
