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

interface PuppeteerHookResult {
  scrapingResults: ScrapingResult[];
  isLoading: boolean;
  error: string | null;
  scrapeCompanies: () => Promise<void>;
  csvData: CSVData | undefined;
  companyNames: string[];
  handleDataUploaded: (data: CSVData) => void;
}

export function usePuppeteer(): PuppeteerHookResult {
  const [scrapingResults, setScrapingResults] = useState<ScrapingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { csvData, companyNames, handleDataUploaded } = useCSVUpload();

  const scrapeCompanies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-scrape', {
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
    scrapeCompanies,
    csvData,
    companyNames,
    handleDataUploaded,
  };
}
