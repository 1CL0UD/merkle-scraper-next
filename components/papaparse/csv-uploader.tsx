'use client';
import React, { CSSProperties } from 'react';
import { useCSVReader } from 'react-papaparse';
import { Button } from '../ui/button';

const styles = {
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  } as CSSProperties,
};

interface CSVUploaderProps {
  onDataUploaded: (data: any) => void;
}

const CSVUploader = ({ onDataUploaded }: CSVUploaderProps) => {
  const { CSVReader } = useCSVReader();

  return (
    <div className="container flex flex-col space-y-12">
      <div className="flex justify-center bg-blue-400 text-white rounded-lg p-12">
        <h1 className="text-7xl">Upload your CSV file here.</h1>
      </div>
      <CSVReader
        onUploadAccepted={(results: any) => {
          console.log('---------------------------');
          console.log(results);
          console.log('---------------------------');
          onDataUploaded(results);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div className="flex flex-row space-x-4">
              <Button {...getRootProps()}>Browse file</Button>
              <div
                {...getRootProps()}
                className="flex items-center justify-start h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 hover:text-slate-500 hover:scale-[1.001]"
              >
                {acceptedFile ? acceptedFile.name : 'Click Here to Upload CSV'}
              </div>
              <Button variant="destructive" {...getRemoveFileProps()}>
                Remove
              </Button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
    </div>
  );
};

export default CSVUploader;
