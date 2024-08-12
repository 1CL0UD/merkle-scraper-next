import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ScrapingResult } from '@/hooks/useLinkedinScrape';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  company: {
    fontSize: 18,
    marginBottom: 10,
  },
  result: {
    marginBottom: 5,
  },
});

interface ScrapingResultsPDFProps {
  scrapingResults: ScrapingResult[];
}

const ScrapingResultsPDF: React.FC<ScrapingResultsPDFProps> = ({
  scrapingResults,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {scrapingResults.map((result, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.company}>{result.company}</Text>
          {result.results.map(
            (
              item: { title: string; url: string; snippet: string },
              idx: number
            ) => (
              <View key={idx} style={styles.result}>
                <Text>{item.title}</Text>
                <Text>{item.url}</Text>
                <Text>{item.snippet}</Text>
              </View>
            )
          )}
        </View>
      ))}
    </Page>
  </Document>
);

export default ScrapingResultsPDF;
