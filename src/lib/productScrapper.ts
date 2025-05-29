import fetch from 'node-fetch';

export interface ProductData {
  name: string;
  image: string;
  rating: number | null;
  total_reviews: number | null;
  price: number | null;
  availability: string | null;
  asin: string;
}

export async function scrapeProducts(asin: string): Promise<ProductData | null> {
  const apiKey = process.env.SCRAPER_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing SCRAPER_API_KEY in environment variables');
    return null;
  }

  const apiUrl = `https://api.scraperapi.com/structured/amazon/product?api_key=${apiKey}&asin=${asin}&country_code=in&tld=in`;

  try {
    const structuredResponse = await fetch(apiUrl);
    if (!structuredResponse.ok) {
      console.error(`❌ ScraperAPI error: ${structuredResponse.status}`);
      return null;
    }

    const data = await structuredResponse.json() as {
      name?: string;
      images?: string[];
      average_rating?: number;
      total_reviews?: number;
      price?: string;
      availability_status?: string;
    };

    const price = parsePrice(data?.price) || (await fetchProductPriceFromHTML(asin));

    return {
      name: data?.name ?? 'Unknown',
      image: data?.images?.[0] ?? '',
      rating: data?.average_rating ?? null,
      total_reviews: data?.total_reviews ?? null,
      price: price ?? null,
      availability: data?.availability_status ?? null,
      asin,
    };
  } catch (error) {
    console.error('❌ Error scraping product:', error);
    return null;
  }
}

function parsePrice(priceStr?: string): number | null {
  if (!priceStr) return null;
  const numeric = priceStr.replace(/[^\d]/g, '');
  return numeric ? parseInt(numeric, 10) : null;
}

async function fetchProductPriceFromHTML(asin: string): Promise<number | null> {
  try {
    const url = `https://www.amazon.in/dp/${asin}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch HTML. Status:', response.status);
      return null;
    }

    const html = await response.text();

    const regexes = [
      /id="priceblock_ourprice".*?>\s*₹?([\d,]+)/i,
      /id="priceblock_dealprice".*?>\s*₹?([\d,]+)/i,
      /"priceToPay".*?>\s*<span.*?>\s*₹?([\d,]+)/i,
      /"a-price-whole">([\d,]+)/i,
    ];

    for (const regex of regexes) {
      const match = html.match(regex);
      if (match && match[1]) {
        return parseInt(match[1].replace(/,/g, ''), 10);
      }
    }

    console.warn('⚠️ No price match found in HTML.');
    return null;
  } catch (error) {
    console.error('❌ Error fetching HTML price:', error);
    return null;
  }
}
