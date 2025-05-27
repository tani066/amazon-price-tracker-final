'use server'


import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { scrapeProducts } from '@/lib/productScrapper';



const ProductAction = async (productID: string) => {
  const session = await auth();
  const userId = session?.user;
  if (!userId) {
    console.error('User not authenticated');
    return false;
  }
  const productRow = await prisma.product.create(
   {
    data: {
      ...await scrapeProducts(productID),
      userEmail: userId.email || '',
    },
   }
  );
}
export default ProductAction;
