
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PredictionMetrics, ModelInfo, TrainingLog } from '@/types/database';
import { fetchModelDetails, fetchModelMetrics, fetchTrainingLogs } from '@/services/stockService';
import ModelInfo from '@/components/ModelInfo';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const ModelDetails: React.FC = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<PredictionMetrics[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch model metrics
        const metricsData = await fetchModelMetrics();
        setMetrics(metricsData);
        
        // Fetch model details
        const modelData = await fetchModelDetails();
        setModelInfo(modelData);
        
        // Fetch training logs
        const logsData = await fetchTrainingLogs();
        setTrainingLogs(logsData);
        
      } catch (error) {
        console.error('Error loading model data:', error);
        toast({
          title: "Error loading model data",
          description: "There was a problem fetching the model information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Prepare feature importance data for chart
  const featureImportanceData = modelInfo?.featureImportance 
    ? Object.entries(modelInfo.featureImportance).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(4))
      }))
    : [];

  // Prepare metrics data for chart
  const metricsChartData = metrics.map(m => ({
    date: m.date,
    rmse: m.rmse,
    r2Score: m.r2Score,
    mape: m.mape || 0
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container py-6 px-4">
          <h1 className="text-2xl font-bold">Model Details & Performance</h1>
          <p className="text-muted-foreground">
            Detailed metrics and information about the ML model used for predictions
          </p>
        </div>
      </header>
      
      <main className="container py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Information */}
          <div className="space-y-6">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <CardTitle>Loading model information...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ) : modelInfo ? (
              <ModelInfo 
                algorithmType={modelInfo.algorithmType}
                features={modelInfo.features}
                hyperparameters={modelInfo.hyperparameters}
                description={modelInfo.description}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Model Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No model information is available.</p>
                </CardContent>
              </Card>
            )}
            
            {/* Feature Importance Chart */}
            {!isLoading && featureImportanceData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Feature Importance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={featureImportanceData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0047AB" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Performance Metrics */}
          <div className="space-y-6">
            {!isLoading && metricsChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={metricsChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(tick) => {
                            const date = new Date(tick);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number, name: string) => {
                            return [value.toFixed(4), name === 'rmse' ? 'RMSE' : name === 'r2Score' ? 'R² Score' : 'MAPE (%)'];
                          }}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            });
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="rmse" stroke="#FF8C00" name="RMSE" />
                        <Line type="monotone" dataKey="r2Score" stroke="#0047AB" name="R² Score" />
                        {metrics.some(m => m.mape !== undefined) && (
                          <Line type="monotone" dataKey="mape" stroke="#8B008B" name="MAPE (%)" />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Training Logs */}
            {!isLoading && trainingLogs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Training History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainingLogs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md border-l-4 ${
                          log.status === 'success' ? 'border-l-green-500 bg-green-50' : 
                          log.status === 'failed' ? 'border-l-red-500 bg-red-50' : 
                          'border-l-yellow-500 bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {new Date(log.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className={`text-sm px-2 py-0.5 rounded-full ${
                            log.status === 'success' ? 'bg-green-100 text-green-800' : 
                            log.status === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          <p>Model: {log.modelVersion}</p>
                          <p>Duration: {(log.duration / 60).toFixed(2)} minutes</p>
                          <p>Iterations: {log.iterations}</p>
                          {log.notes && <p className="mt-1 italic">{log.notes}</p>}
                          {log.errorMessage && (
                            <p className="mt-1 text-red-600">{log.errorMessage}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelDetails;
