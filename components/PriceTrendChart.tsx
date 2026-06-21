import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export interface PriceTrendChartProps {
  areaName: string;
}

// Generate some mock historical data based on the area name to have slightly varied data
const generateMockData = (areaName: string) => {
  const basePrice = (areaName.length % 10) * 1000000 + 5000000;
  
  const currentYear = new Date().getFullYear();
  const data = [];
  
  for (let i = 5; i >= 0; i--) {
    const year = currentYear - i;
    // Add some random fluctuation based on year and area
    const fluctuation = (Math.sin(year * Math.PI / 2 + areaName.length) * 0.2 + 1);
    
    // Add general upward trend
    const trend = 1 + ((5 - i) * 0.15);
    
    data.push({
      year: year.toString(),
      price: Math.round(basePrice * trend * fluctuation),
    });
  }
  
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-primary">
          <span className="font-medium">Avg. Price: </span>
          Rs {payload[0].value.toLocaleString("en-PK")}
        </p>
      </div>
    );
  }

  return null;
};

export function PriceTrendChart({ areaName }: PriceTrendChartProps) {
  const data = generateMockData(areaName);
  
  const formatYAxis = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)} Crore`;
    }
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)} Lac`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-72 mt-4">
      <div className="mb-4">
        <h4 className="font-semibold text-xl">Historical Price Trends</h4>
        <p className="text-sm text-muted-foreground">Average property prices in {areaName} over the last 5 years.</p>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.2} />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888888', fontSize: 12 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="var(--color-primary, #3b82f6)" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
