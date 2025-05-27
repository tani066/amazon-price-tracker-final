'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface LinechartProps {
  data?: {
    x: string;
    price: number;
  }[];
  label?: string;
  color?: string;
}

const Linechart: React.FC<LinechartProps> = ({
  data = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  label = 'Price',
  color = 'hsl(var(--chart-1))',
}) => {
  // Handle case when no data is available
  const chartData =
    data.length === 0
      ? [
          { x: 'No Data', price: 0 },
          { x: '', price: 0 },
        ]
      : data;

  return (
    <div className="w-full h-[140px] sm:h-[160px] px-2 pt-2 -mb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.7} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            interval="preserveStartEnd"
            minTickGap={10}
          />
          <YAxis
            dataKey="price"
            width={40}
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            wrapperStyle={{ zIndex: 50 }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => `₹${value.toFixed(2)}`}
            labelFormatter={(label: string) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fill="url(#gradientFill)"
            dot={{ r: 1.5 }}
            isAnimationActive={data.length !== 0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linechart;
