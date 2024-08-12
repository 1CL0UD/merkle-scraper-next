// components/GoogleSearchResult.tsx

import { findRelevantResult } from '@/lib/utils';
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
  const relevantResult = findRelevantResult(company, results);

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
