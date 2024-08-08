// hooks/useDDGS.ts

import { useState } from 'react';
import { useCSVUpload } from './useCSVUpload';

interface CSVData {
  data: string[][];
  meta: {
    fields: string[];
  };
}

interface GoogleSearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface ScrapingResult {
  company: string;
  results: GoogleSearchResult[];
}

interface LinkedinScrapeHookResult {
  scrapingResults: ScrapingResult[];
  isLoading: boolean;
  error: string | null;
  scrapeLinkedin: (companyNames: string[]) => Promise<void>;
}

export function useLinkedinScrape(): LinkedinScrapeHookResult {
  const [scrapingResults, setScrapingResults] = useState<ScrapingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeLinkedin = async (companyNames: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/linkedin-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companies: companyNames }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scraping results');
      }

      const results: ScrapingResult[] = await response.json();
      setScrapingResults(results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scrapingResults,
    isLoading,
    error,
    scrapeLinkedin,
  };
}
