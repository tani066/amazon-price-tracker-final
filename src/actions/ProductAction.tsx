'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { scrapeProducts } from '@/lib/productScrapper';

interface ProductData {
  name: string;
  price: string | null;
  availability_status?: string | null;
  image?: string;
  average_rating?: number;
  total_reviews?: number;
  // Add other needed fields here
}

const ProductAction = async (productID: string) => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    console.error('User not authenticated');
    return false;
  }

  const productData = await scrapeProducts(productID) as ProductData | null;

  if (!productData) {
    console.error('Failed to scrape product data');
    return false;
  }

  // Ensure required fields exist, fallback if needed
  // const dataToSave = {
  //   name: productData.name,
  //   price: productData.price || '0',
  //   availability_status: productData.availability_status || null,
  //   image: productData.image || null,
  //   average_rating: productData.average_rating || null,
  //   total_reviews: productData.total_reviews || null,
  //   userEmail: user.email || '',
  // };

  await prisma.product.create({
    data: {
      userEmail: user.email || '',
      amazonId: productID,
      title: productData.name || 'Unknown Product',
      img: productData.image || '',
      price: parseInt(productData.price ?? '0') || 0, // ✅ must be an Int
      reviewsCount: parseInt(productData.total_reviews?.toString() || '0') || 0,
      reviewsAverageRating: Math.round(productData.average_rating || 0),
    },
  });
  
  

  return true;
};

export default ProductAction;
