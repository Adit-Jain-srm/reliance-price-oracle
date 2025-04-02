
import React from 'react';
import { ArrowDownIcon, ArrowUpIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  stockName: string;
  currentPrice: number;
  previousClose: number;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  stockName, 
  currentPrice, 
  previousClose, 
  onRefresh,
  isLoading = false,
}) => {
  const priceChange = currentPrice - previousClose;
  const changePercent = (priceChange / previousClose) * 100;
  const isPositive = priceChange >= 0;
  const showPriceInfo = currentPrice !== 0 || previousClose !== 0;
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stockName}</h1>
            {showPriceInfo && (
              <div className="flex items-center mt-1">
                <span className="text-xl font-medium mr-2">
                  ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <div className={`flex items-center text-sm px-2 py-1 rounded-md ${
                  isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isPositive ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(changePercent).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <Button 
              onClick={onRefresh} 
              disabled={isLoading}
              className="flex items-center"
            >
              <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
