'use client';

import GoogleSearchResult from '@/components/GoogleSearchResult';
import CSVDataDisplay from '@/components/papaparse/csv-data-display';
import CSVUploader from '@/components/papaparse/csv-uploader';
import { useCSVUpload } from '@/hooks/useCSVUpload';
import { useLinkedinScrape } from '@/hooks/useLinkedinScrape';

export default function Page() {
  const { csvData, handleDataUploaded, companyNames } = useCSVUpload();

  const { scrapingResults, isLoading, error, scrapeLinkedin } =
    useLinkedinScrape();

  return (
    <main className="container flex flex-col my-12">
      <CSVUploader
        onDataUploaded={handleDataUploaded}
        subtitle="Search Companies Linkedin Profile"
      />
      <CSVDataDisplay data={csvData} />
      {companyNames.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => scrapeLinkedin(companyNames)}
            disabled={isLoading}
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
          >
            {isLoading ? 'Scraping...' : 'Scrape Linkedin Profile'}
          </button>
        </div>
      )}

      {error && <p>Error: {error}</p>}

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
                  results={result.results}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
