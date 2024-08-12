// hooks/useDDGS.ts

import { useState } from 'react';

interface CSVData {
  data: string[][];
  meta: {
    fields: string[];
  };
}

export interface GoogleSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ScrapingResult {
  company: string;
  results: GoogleSearchResult[];
}

export interface Employee {
  name: string;
  position: string;
}

export interface CompanyEmployees {
  company: string;
  employees: Employee[];
}

interface LinkedinScrapeHookResult {
  scrapingResults: ScrapingResult[];
  employeeResults: CompanyEmployees[];
  isLoading: boolean;
  error: string | null;
  scrapeLinkedin: (companyNames: string[]) => Promise<void>;
  scrapeEmployees: (urls: string[]) => Promise<void>;
}

export function useLinkedinScrape(): LinkedinScrapeHookResult {
  const [scrapingResults, setScrapingResults] = useState<ScrapingResult[]>([]);
  const [employeeResults, setEmployeeResults] = useState<CompanyEmployees[]>(
    []
  );

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

  const scrapeEmployees = async (urls: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/employee-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }

      const results: CompanyEmployees[] = await response.json();
      console.log(results);
      setEmployeeResults(results);
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
    employeeResults,
    isLoading,
    error,
    scrapeLinkedin,
    scrapeEmployees,
  };
}
