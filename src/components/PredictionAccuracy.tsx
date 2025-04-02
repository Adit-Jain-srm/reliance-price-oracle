
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PredictionAccuracyProps {
  data: {
    dates: string[];
    actual: number[];
    predicted: number[];
  };
}

export const PredictionAccuracy: React.FC<PredictionAccuracyProps> = ({ data }) => {
  // Transform the data into the format required by Recharts
  const chartData = data.dates.map((date, index) => ({
    date,
    actual: data.actual[index],
    predicted: data.predicted[index],
    difference: Math.abs(data.actual[index] - data.predicted[index]),
    errorPercent: Math.abs((data.actual[index] - data.predicted[index]) / data.actual[index] * 100)
  }));
  
  // Calculate average error
  const averageErrorPercent = chartData.reduce((sum, item) => sum + item.errorPercent, 0) / chartData.length;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Prediction Accuracy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm">
          <div className="flex justify-between">
            <span>Average prediction error:</span>
            <span className="font-medium">{averageErrorPercent.toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
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
                tickFormatter={(tick) => `₹${tick.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 
                  value === chartData[0].errorPercent ? 'Error %' : 
                  value === chartData[0].difference ? 'Difference' : 
                  value === chartData[0].actual ? 'Actual Price' : 'Predicted Price'
                ]}
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
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#0047AB" 
                name="Actual Price" 
                dot={{ r: 1 }}
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#FF8C00" 
                name="Predicted Price" 
                dot={{ r: 1 }}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionAccuracy;
