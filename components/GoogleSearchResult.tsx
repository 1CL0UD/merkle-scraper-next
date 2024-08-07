// components/GoogleSearchResult.tsx

import React from 'react';

interface GoogleSearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface Props {
  company: string;
  results: GoogleSearchResult[];
}

const GoogleSearchResult: React.FC<Props> = ({ company, results }) => {
  const findRelevantResult = (
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

  const relevantResult = findRelevantResult(results);

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">{company}</h3>
      {relevantResult ? (
        <div>
          <a
            href={relevantResult.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {relevantResult.title}
          </a>
          <p className="text-sm text-gray-600">{relevantResult.url}</p>
          <p>{relevantResult.snippet}</p>
        </div>
      ) : (
        <p>No relevant result found</p>
      )}
    </div>
  );
};

export default GoogleSearchResult;
