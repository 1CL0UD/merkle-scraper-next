// File: app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyUrl = searchParams.get('companyUrl');

  if (!companyUrl) {
    return NextResponse.json(
      { error: 'Company URL is required' },
      { status: 400 }
    );
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(companyUrl, { waitUntil: 'networkidle0' });

    // Wait for the employees section to load
    await page.waitForSelector('.org-people-profiles-module__profile-list');

    // Extract employee information
    const employees = await page.evaluate(() => {
      const employeeList = document.querySelectorAll(
        '.org-people-profile-card'
      );
      return Array.from(employeeList).map((employee) => {
        const nameElement = employee.querySelector(
          '.org-people-profile-card__profile-title'
        );
        const titleElement = employee.querySelector(
          '.org-people-profile-card__profile-position'
        );

        return {
          name: nameElement ? nameElement.textContent?.trim() : '',
          title: titleElement ? titleElement.textContent?.trim() : '',
        };
      });
    });

    await browser.close();

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape data' },
      { status: 500 }
    );
  }
}
