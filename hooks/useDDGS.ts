// hooks/useDDGS.ts

import { useState } from 'react';
import { SearchResults } from 'duck-duck-scrape';

interface CSVData {
  data: string[][];
  meta: {
    fields: string[];
  };
}

interface DDGSHookResult {
  csvData: CSVData | undefined;
  companyNames: string[];
  scrapingResults: SearchResults[];
  isLoading: boolean;
  error: string | null;
  handleDataUploaded: (data: CSVData) => void;
  scrapeCompanies: () => Promise<void>;
}

export function useDDGS(): DDGSHookResult {
  const [csvData, setCsvData] = useState<CSVData | undefined>(undefined);
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [scrapingResults, setScrapingResults] = useState<SearchResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataUploaded = (data: CSVData) => {
    setCsvData(data);
    const names = data.data.slice(1).map((row) => row[0]);
    setCompanyNames(names);
    console.log('Company names:', names);
  };

  const scrapeCompanies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companies: companyNames }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch scraping results');
      }

      const results: SearchResults[] = await response.json();
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
    csvData,
    companyNames,
    scrapingResults,
    isLoading,
    error,
    handleDataUploaded,
    scrapeCompanies,
  };
}
