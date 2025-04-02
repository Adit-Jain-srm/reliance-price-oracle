
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PricePredictionProps {
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  predictedDate: string;
  isLoading?: boolean;
}

export const PricePrediction: React.FC<PricePredictionProps> = ({ 
  currentPrice, 
  predictedPrice, 
  predictedChange, 
  predictedDate,
  isLoading = false
}) => {
  const isPriceUp = predictedChange > 0;
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Next Day Price Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Next Day Price Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Our ML model predicts the price for {new Date(predictedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold">
              ₹{predictedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-sm px-2 py-1 rounded-md ${
              isPriceUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPriceUp ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(predictedChange).toFixed(2)}%
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Current price: ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          
          <div className={`text-sm font-medium mt-2 ${
            isPriceUp ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPriceUp 
              ? 'Model predicts an upward movement' 
              : 'Model predicts a downward movement'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricePrediction;
