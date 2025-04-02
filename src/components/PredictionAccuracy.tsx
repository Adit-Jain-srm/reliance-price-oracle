
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, ComposedChart
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
    <Card className="w-full border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-blue-800">Prediction Accuracy</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-blue-800 font-medium">Average prediction error:</span>
            <span className={`font-bold text-lg ${averageErrorPercent < 5 ? 'text-green-600' : averageErrorPercent < 10 ? 'text-amber-600' : 'text-red-600'}`}>
              {averageErrorPercent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                minTickGap={30}
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                dy={10}
                tick={{fill: '#333'}}
              />
              <YAxis 
                tickFormatter={(tick) => `₹${tick.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                tick={{fill: '#333'}}
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
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend 
                wrapperStyle={{paddingTop: '10px'}}
                formatter={(value) => <span className="text-sm font-medium">{value}</span>}
              />
              <Area
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                fill="url(#actualGradient)"
                name="Actual Price" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#7c3aed" 
                name="Predicted Price" 
                strokeWidth={2}
                dot={{ fill: '#7c3aed', r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionAccuracy;
