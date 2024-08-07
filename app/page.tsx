'use client';
import GoogleSearchResult from '@/components/GoogleSearchResult';
import CSVDataDisplay from '@/components/papaparse/csv-data-display';
import CSVUploader from '@/components/papaparse/csv-uploader';
import { useDDGS } from '@/hooks/useDDGS';
import { usePuppeteer } from '@/hooks/usePuppeteer';
import { SearchResults } from 'duck-duck-scrape';
import { useState } from 'react';

export default function Home() {
  // const [csvData, setCSVData] = useState<CSVData | undefined>(undefined);
  // const [companyNames, setCompanyNames] = useState<string[]>([]);

  const {
    csvData,
    companyNames,
    scrapingResults,
    isLoading,
    error,
    handleDataUploaded,
    scrapeCompanies,
  } = usePuppeteer();

  return (
    <main className="container my-12 flex flex-col justify-center">
      <CSVUploader onDataUploaded={handleDataUploaded} />
      <CSVDataDisplay data={csvData} />
      {companyNames.length > 0 && (
        <div className="mt-8">
          <button
            onClick={scrapeCompanies}
            disabled={isLoading}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
          >
            {isLoading ? 'Scraping...' : 'Scrape Companies'}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {scrapingResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Scraping Results</h2>
          {scrapingResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Google Search Results</h2>
              {scrapingResults.map((result, index) => (
                <GoogleSearchResult
                  key={index}
                  company={result.company}
                  results={result.results} // Pass the first result
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
