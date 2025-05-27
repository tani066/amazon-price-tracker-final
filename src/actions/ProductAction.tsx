'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { scrapeProducts } from '@/lib/productScrapper';

const ProductAction = async (productID: string) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const productData = await scrapeProducts(productID);

  if (!productData) {
    console.error('Failed to scrape product data');
    return false;
  }

  await prisma.product.create({
    data: {
      ...productData,
      userEmail: user.email || '',
    },
  });

  return true;
};

export default ProductAction;
