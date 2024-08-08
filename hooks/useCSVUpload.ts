import { CSVData } from '@/components/papaparse/csv-data-display';
import { useState } from 'react';

interface ReturnProps {
  csvData: CSVData | undefined;
  companyNames: string[];
  handleDataUploaded: (data: CSVData) => void;
}

export function useCSVUpload(): ReturnProps {
  const [csvData, setCsvData] = useState<CSVData | undefined>(undefined);
  const [companyNames, setCompanyNames] = useState<string[]>([]);

  const handleDataUploaded = (data: CSVData) => {
    setCsvData(data);
    const names = data.data.slice(1).map((row) => row[0]);
    setCompanyNames(names);
  };

  return {
    csvData,
    companyNames,
    handleDataUploaded,
  };
}
