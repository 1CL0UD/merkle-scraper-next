'use client';
import CSVDataDisplay, {
  CSVData,
} from '@/components/papaparse/csv-data-display';
import CSVUploader from '@/components/papaparse/csv-uploader';
import { useState } from 'react';

export default function Home() {
  const [csvData, setCSVData] = useState<CSVData | undefined>(undefined);

  const handleDataUploaded = (data: any) => {
    setCSVData(data);
  };
  return (
    <main className="container my-12 flex flex-col justify-center">
      <CSVUploader onDataUploaded={handleDataUploaded} />
      <CSVDataDisplay data={csvData} />
    </main>
  );
}
