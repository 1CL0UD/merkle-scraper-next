// app/api/linkedin-scrape/route.ts

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function scrapeGoogleResults(companyName: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    `https://www.google.com/search?q=${encodeURIComponent(
      companyName
    )} "site:linkedin.com"`
  );

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.g'))
      .slice(0, 5)
      .map((result) => {
        const titleElement = result.querySelector('h3');
        const linkElement = result.querySelector('a');
        const snippetElement = result.querySelector('.VwiC3b');

        return {
          title: titleElement ? titleElement.textContent : '',
          url: linkElement ? linkElement.getAttribute('href') : '',
          snippet: snippetElement ? snippetElement.textContent : '',
        };
      });
  });

  await browser.close();
  return results;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companies } = body;

  if (!Array.isArray(companies)) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      companies.map(async (company) => ({
        company,
        results: await scrapeGoogleResults(company),
      }))
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { message: 'Error occurred while scraping' },
      { status: 500 }
    );
  }
}
