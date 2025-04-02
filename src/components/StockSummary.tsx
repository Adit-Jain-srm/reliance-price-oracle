
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUpIcon, TrendingDownIcon, BarChart2Icon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StockData } from '@/types/database';

interface StockSummaryProps {
  data?: StockData;
  isLoading?: boolean;
}

export const StockSummary: React.FC<StockSummaryProps> = ({ data, isLoading = false }) => {
  if (isLoading || !data) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reliance Industries (RELIANCE.NS)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const priceChange = data.close - data.open;
  const priceChangePercent = (priceChange / data.open) * 100;
  const isPriceUp = priceChange >= 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Reliance Industries (RELIANCE.NS)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="text-3xl font-bold mr-3">
              ₹{data.close.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-sm px-2 py-1 rounded-md ${
              isPriceUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPriceUp ? (
                <TrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(priceChangePercent).toFixed(2)}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open</span>
              <span>₹{data.open.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">High</span>
              <span>₹{data.high.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Low</span>
              <span>₹{data.low.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume</span>
              <span>{data.volume.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date(data.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground flex items-center">
            <BarChart2Icon className="h-3 w-3 mr-1" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockSummary;
