'use client';
import CSVDataDisplay from '@/components/papaparse/csv-data-display';
import CSVUploader from '@/components/papaparse/csv-uploader';
import { useDDGS } from '@/hooks/useDDGS';
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
  } = useDDGS();

  return (
    <main className="container my-12 flex flex-col justify-center">
      <CSVUploader onDataUploaded={handleDataUploaded} />
      <CSVDataDisplay data={csvData} />

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {scrapingResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Scraping Results</h2>
          {scrapingResults.map((result: SearchResults, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{companyNames[index]}</h3>
              <ul className="list-disc pl-5">
                {result.results.slice(0, 3).map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
