'use client';

import CSVUploader from '@/components/papaparse/csv-uploader';

export default function Page() {
  return (
    <main className="container flex flex-col my-12">
      <CSVUploader onDataUploaded={() => console.log('Uploaded')} />
    </main>
  );
}
