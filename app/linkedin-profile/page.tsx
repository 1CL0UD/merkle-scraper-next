'use client';

import GoogleSearchResult from '@/components/GoogleSearchResult';
import CSVDataDisplay from '@/components/papaparse/csv-data-display';
import CSVUploader from '@/components/papaparse/csv-uploader';
import ScrapingResultsPDF from '@/components/ScrapingResultsPDF';
import { Button } from '@/components/ui/button';
import { useCSVUpload } from '@/hooks/useCSVUpload';
import { ScrapingResult, useLinkedinScrape } from '@/hooks/useLinkedinScrape';
import { findRelevantResult } from '@/lib/utils';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CSVLink } from 'react-csv';

export default function Page() {
  const { csvData, handleDataUploaded, companyNames } = useCSVUpload();

  const { scrapingResults, isLoading, error, scrapeLinkedin } =
    useLinkedinScrape();

  const transformScrapingResultsToCSV = (scrapingResults: ScrapingResult[]) => {
    return scrapingResults.map(({ company, results }) => {
      const relevantResult = findRelevantResult(company, results);
      return {
        company,
        title: relevantResult?.title || '',
        url: relevantResult?.url || '',
        snippet: relevantResult?.snippet || '',
      };
    });
  };

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
          <PDFDownloadLink
            document={<ScrapingResultsPDF scrapingResults={scrapingResults} />}
            fileName="scraping_results.pdf"
            className="mt-4 inline-block py-2 px-4 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition-colors"
          >
            {({ blob, url, loading, error }) =>
              loading ? 'Generating PDF...' : 'Download as PDF'
            }
          </PDFDownloadLink>
          <CSVLink
            data={transformScrapingResultsToCSV(scrapingResults)}
            filename="scraping_results.csv"
            className="mt-4 inline-block py-2 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
          >
            Download as CSV
          </CSVLink>
        </div>
      )}
    </main>
  );
}
