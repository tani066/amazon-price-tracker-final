
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
export async function scrapeProducts(productID: string) {
  const parsePrice = (priceStr: string): number => {
    // Remove currency symbol and commas, parse to int
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[₹,]/g, '').split('.')[0];
    return parseInt(cleaned, 10) || 0;
  };
  
  const parseReviewsCount = (reviewsStr: string): number => {
    if (!reviewsStr) return 0;
    const match = reviewsStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  const parseRating = (ratingStr: string): number => {
    if (!ratingStr) return 0;
    const rating = parseFloat(ratingStr);
    return Math.round(rating);
    
  };
  const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;;
  const amazonUrl = `https://www.amazon.in/dp/${productID}`;
  if (!SCRAPER_API_KEY) {
    throw new Error('Missing SCRAPER_API_KEY in environment variables.');
  }
  try {
    const response = await fetch(
      `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${amazonUrl}`
    );

    if (!response.ok) {
      console.error('Failed to fetch page');
      return false;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('#productTitle').text().trim();

    const image =
      $('#landingImage').attr('src') ||
      $('img#imgBlkFront').attr('src') ||
      $('img.a-dynamic-image').attr('src') ||
      '';

    // Price selectors
    const priceSelectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#priceblock_saleprice',
      '#corePriceDisplay_desktop_feature_div .a-offscreen',
      '.a-price .a-offscreen',
      '#tp_price_block_total_price_ww .a-offscreen',
    ];

    let price = '';
    for (const selector of priceSelectors) {
      price = $(selector).first().text().trim();
      if (price) break;
    }

    if (!price) {
      console.warn('⚠️ Price not found.');
    }

    const ratingRaw = $('span.a-icon-alt').first().text().trim().split(' ')[0];
    const reviewsRaw = $('#acrCustomerReviewText').text().trim();

    // Parse to correct types
    const priceInt = parsePrice(price);
    const reviewsCount = parseReviewsCount(reviewsRaw);
    const averageRating = parseRating(ratingRaw);

    // Save to DB
   return {
    amazonId: productID,
    title:title,
    img: image,
    price: priceInt,
    reviewsCount,
    reviewsAverageRating: averageRating,
  }


  } catch (error) {
    console.error('An error occurred while scraping products:', error);
    return false;
  }
}