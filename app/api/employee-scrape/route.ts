import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

async function scrapeLinkedInEmployees(linkedinUrl: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // Directly navigate to the '/people' page
    const peopleUrl = linkedinUrl.endsWith('/')
      ? `${linkedinUrl}people/`
      : `${linkedinUrl}/people/`;
    await page.goto(peopleUrl, { waitUntil: 'networkidle' });

    // Check if we're on a valid people page
    const isValidPeoplePage = await page.evaluate(() => {
      return !!document.querySelector('.org-people__header');
    });

    if (!isValidPeoplePage) {
      console.log(`Not a valid people page: ${peopleUrl}`);
      return [];
    }

    // Scrape employee information
    const employees = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.org-people-profile-card'))
        .slice(0, 5)
        .map((card) => {
          const nameElement = card.querySelector(
            '.org-people-profile-card__profile-title'
          );
          const positionElement = card.querySelector(
            '.org-people-profile-card__profile-position'
          );
          return {
            name: nameElement?.textContent?.trim() || '',
            position: positionElement?.textContent?.trim() || '',
          };
        });
    });

    return employees;
  } catch (error) {
    console.error(`Error scraping ${linkedinUrl}:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { urls } = body;

  if (!Array.isArray(urls) || !urls.every((url) => typeof url === 'string')) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      urls.map(async (url) => ({
        company: url,
        employees: await scrapeLinkedInEmployees(url),
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
