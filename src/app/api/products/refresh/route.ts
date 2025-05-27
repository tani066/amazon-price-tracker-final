import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scrapeProducts } from '@/lib/productScrapper';
import { endOfDay, isToday, startOfDay, subDays } from 'date-fns';

export async function GET() {
  const products = await prisma.product.findMany();

  for (const product of products) {
    const latestHistorydata = await prisma.productDataHistory.findFirst({
      where: { amazonId: product.amazonId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestHistorydata && isToday(latestHistorydata.createdAt)) {
      continue;
    }

    const newProductData = await scrapeProducts(product.amazonId);

    if (!newProductData) {
      console.warn(`❌ Failed to scrape product with ID: ${product.amazonId}`);
      continue;
    }

    await prisma.productDataHistory.create({
      data: {
        amazonId: product.amazonId,
        title: product.title,
        img: product.img,
        reviewsCount: 0, // Default to 0 as reviewsCount is not available in ProductData
        reviewsAverageRating: 0, // Default to 0 as reviewsAverageRating is not available in ProductData
        price: newProductData.price ?? 0,
        createdAt: new Date(),
      },
    });

    const prevData = await prisma.productDataHistory.findFirst({
      where: {
        amazonId: product.amazonId,
        createdAt: {
          gt: startOfDay(subDays(new Date(), 1)),
          lt: endOfDay(subDays(new Date(), 1)),
        },
      },
    });

    if (prevData && typeof prevData.price === 'number' && typeof newProductData.price === 'number' && prevData.price > newProductData.price) {
      await prisma.notification.create({
        data: {
          userEmail: product.userEmail,
          amazonId: product.amazonId,
          title: `The price of ${product.title} has decreased from ₹${prevData.price} to ₹${newProductData.price}`,
        },
      });
    }
  }

  return NextResponse.json({ status: 'ok' });
}
