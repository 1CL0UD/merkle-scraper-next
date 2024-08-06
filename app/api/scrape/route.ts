// app/api/scrape/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { search, SafeSearchType, SearchResults } from 'duck-duck-scrape';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { companies } = body;

  if (!Array.isArray(companies)) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const results: SearchResults[] = await Promise.all(
      companies.map((company: string) =>
        search(company, { safeSearch: SafeSearchType.MODERATE })
      )
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
