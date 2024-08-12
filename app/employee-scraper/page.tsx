'use client';
import { useState } from 'react';
import CSVUploader from '@/components/papaparse/csv-uploader';
import { useLinkedinScrape } from '@/hooks/useLinkedinScrape';

export default function Page() {
  const [companyUrls, setCompanyUrls] = useState<string[]>([]);
  const { employeeResults, isLoading, error, scrapeEmployees } =
    useLinkedinScrape();

  const extractCompanyUrls = (results: any) => {
    const data = results.data;

    if (Array.isArray(data)) {
      // Skip the header row by slicing from the second row
      const urls = data
        .slice(1)
        .map((row: any) => row[2])
        .filter((url: string) => url && url !== 'url'); // Skip 'url' if it's in the data
      setCompanyUrls(urls);
    } else {
      console.error('Expected results.data to be an array but got:', data);
    }
  };

  return (
    <main className="container flex flex-col my-12">
      <CSVUploader
        onDataUploaded={extractCompanyUrls}
        subtitle="Upload CSV with Company URLs"
      />
      {companyUrls.length > 0 && (
        <button
          onClick={() => scrapeEmployees(companyUrls)}
          disabled={isLoading}
          className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
        >
          {isLoading ? 'Scraping Employees...' : 'Scrape Employee Data'}
        </button>
      )}
      {/* Display Results */}
      {employeeResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Employee Data</h2>
          {employeeResults.map(({ company, employees }, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold">{company}</h3>
              {employees.length > 0 ? (
                <ul className="list-disc ml-6">
                  {employees.map((employee, idx) => (
                    <li key={idx}>
                      {employee.name} - {employee.position}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No employees found or unable to scrape data.</p>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
