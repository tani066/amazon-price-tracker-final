import React from 'react';
import DashboardTopCard from './DashboardTopCard';
import DashboardProductCard from './DashboardProductCard';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

const Dashboard = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  const products = await prisma.product.findMany({
    where: { userEmail: user.email },
  });

  const productIds = products.map((product) => product.amazonId);

  const history = await prisma.productDataHistory.findMany({
    where: { amazonId: { in: productIds } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="col-span-9">
      <div className="bg-white rounded-2xl p-6 shadow-md w-full h-full overflow-hidden flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

        {/* Top Summary Card full width */}
        <div className="mb-6">
          <DashboardTopCard products={products} history={history} />
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
          {products.map((product) => (
            <DashboardProductCard
              key={product.id}
              product={product}
              history={history.filter((item) => item.amazonId === product.amazonId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
