'use client';
import React from 'react';
import { Card } from './ui/card';
import Linechart from './Linechart';
import { Product, ProductDataHistory } from '../../generated/prisma/default';
import TimeAgo from './TimeAgo';

interface DashboardProductCardProps {
  product: Product;
  history: ProductDataHistory[];
}

const DashboardProductCard = ({ product, history }: DashboardProductCardProps) => {
  const chartData = history.map((hp) => ({
    x: new Date(hp.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    price: hp.price,
  }));

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        {/* Product Image */}
        <div className="w-32 h-32 flex-shrink-0 flex justify-center items-center overflow-hidden rounded-lg bg-gray-100 shadow-sm">
          <img
            src={product.img}
            alt={product.title ?? 'Product Image'}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Product Info and Chart */}
        <div className="flex flex-col flex-grow min-w-0 w-full">
          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <h3
              className="font-semibold text-sm sm:text-lg max-w-[300px] truncate"
              title={product.title ?? 'Product Name'}
            >
              {product.title?.substring(0, 20) ?? 'Product Name'}
            </h3>

            <div className="mt-1 sm:mt-0 text-green-700 font-bold text-lg">
            {product.price !== null ? `₹${product.price}` : 'Price unavailable'}

            </div>
          </div>

          {/* Time ago */}
          <div className="text-xs text-gray-500 mb-2">
            <TimeAgo date={product.updatedAt} />
          </div>

          {/* Price Chart */}
          <div className="w-full h-24 sm:h-32 mt-5">
            <Linechart data={chartData} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardProductCard;
