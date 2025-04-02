
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, ComposedChart 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockData } from '@/types/database';

interface StockChartProps {
  data: StockData[];
  title: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, title }) => {
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '6M' | '1Y' | 'All'>('1M');
  
  const getFilteredData = () => {
    const now = new Date();
    let pastDate = new Date();
    
    switch (timeRange) {
      case '1W':
        pastDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        pastDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        pastDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        pastDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        pastDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'All':
      default:
        return data;
    }
    
    const pastDateStr = pastDate.toISOString().split('T')[0];
    return data.filter(item => item.date >= pastDateStr);
  };
  
  const filteredData = getFilteredData();
  
  // Find the min and max for better axis formatting
  const priceMin = Math.min(...filteredData.map(d => d.low));
  const priceMax = Math.max(...filteredData.map(d => d.high));
  const yDomain = [Math.floor(priceMin * 0.98), Math.ceil(priceMax * 1.02)];
  
  // Format the data for the tooltip
  const formatTooltip = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant={timeRange === '1W' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('1W')}
          >
            1W
          </Button>
          <Button 
            variant={timeRange === '1M' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('1M')}
          >
            1M
          </Button>
          <Button 
            variant={timeRange === '3M' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('3M')}
          >
            3M
          </Button>
          <Button 
            variant={timeRange === '6M' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('6M')}
          >
            6M
          </Button>
          <Button 
            variant={timeRange === '1Y' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('1Y')}
          >
            1Y
          </Button>
          <Button 
            variant={timeRange === 'All' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('All')}
          >
            All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <defs>
                <linearGradient id="colorPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0047AB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0047AB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis 
                dataKey="date" 
                minTickGap={30} 
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                dy={10}
              />
              <YAxis 
                domain={yDomain}
                tickFormatter={(tick) => `₹${tick.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="close" 
                fill="url(#colorPriceGradient)" 
                stroke="#0047AB" 
                name="Close Price" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="predictedClose" 
                stroke="#FF8C00" 
                name="Predicted Price" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
