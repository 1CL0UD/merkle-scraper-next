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
          <div className="flex flex-row">
            <Button {...getRootProps()}>Browse file</Button>
            <div className="flex items-center justify-start border w-full h-10 px-2">
              {acceptedFile && acceptedFile.name}
            </div>
            <Button variant="destructive" {...getRemoveFileProps()}>
              Remove
            </Button>
          </div>
          <ProgressBar style={styles.progressBarBackgroundColor} />
        </>
      )}
    </CSVReader>
  );
};

export default CSVUploader;
