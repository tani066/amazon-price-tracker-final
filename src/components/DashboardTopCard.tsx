'use client';
import React from 'react';
import { Card } from './ui/card';
import Linechart from './Linechart';
import { Product, ProductDataHistory } from '../../generated/prisma/default';

interface DashboardTopCardProps {
  products: Product[];
  history: ProductDataHistory[];
}

const DashboardTopCard = ({ products = [], history = [] }: DashboardTopCardProps) => {
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  const aggregatedHistory = history.map((h) => ({
    x: h.createdAt.toLocaleDateString(),
    price: h.price,
  }));

  return (
    <Card className="w-full px-6 py-5 text-sm font-medium text-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Total Price Info */}
        <div>
          <p className="text-base sm:text-lg font-semibold">Total Price</p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900">
            ₹{totalPrice.toLocaleString()}
          </p>
        </div>

        {/* Line Chart */}
        <div className="w-full sm:w-2/3 h-24 sm:h-28">
          <Linechart data={aggregatedHistory} />
        </div>
      </div>
    </Card>
  );
};

export default DashboardTopCard;
