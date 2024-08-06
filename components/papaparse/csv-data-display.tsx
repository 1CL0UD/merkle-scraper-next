'use client';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface CSVData {
  data: string[][];
  meta: {
    fields: string[];
  };
}

interface Props {
  data?: CSVData;
}

const CSVDataDisplay = ({ data }: Props) => {
  if (!data) return null;

  const headers = data.meta.fields || data.data[0];
  const rows = data.meta.fields ? data.data : data.data.slice(1);
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">CSV Data</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CSVDataDisplay;
