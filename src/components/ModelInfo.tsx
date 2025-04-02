
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModelInfoProps {
  algorithmType: string;
  features: string[];
  hyperparameters: Record<string, any>;
  description: string;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({
  algorithmType,
  features,
  hyperparameters,
  description
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Model Information</CardTitle>
        <CardDescription>{algorithmType}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Features Used</h4>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="outline">{feature}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Hyperparameters</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(hyperparameters).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value.toString()}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelInfo;
