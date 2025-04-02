
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ModelMetricsProps {
  rmse: number;
  r2Score: number;
  modelVersion: string;
  trainDate: string;
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ rmse, r2Score, modelVersion, trainDate }) => {
  // Normalize R² score for display (0 to 100%)
  const r2ScorePercent = Math.max(0, Math.min(100, r2Score * 100));
  
  // Normalize RMSE inversely (lower is better)
  // Assuming RMSE ranges from 0 to 100 in this example
  const rmsePercent = Math.max(0, Math.min(100, (1 - rmse / 100) * 100));
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">R² Score (Higher is better)</span>
              <span className="text-sm font-medium">{r2Score.toFixed(2)}</span>
            </div>
            <Progress value={r2ScorePercent} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">RMSE (Lower is better)</span>
              <span className="text-sm font-medium">{rmse.toFixed(2)}</span>
            </div>
            <Progress value={rmsePercent} className="h-2" />
          </div>
          
          <div className="pt-2 border-t text-sm text-muted-foreground">
            <div>Model Version: {modelVersion}</div>
            <div>Last Trained: {new Date(trainDate).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelMetrics;
