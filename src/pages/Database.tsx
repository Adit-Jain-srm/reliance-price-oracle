
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockData, DatabaseStats } from '@/types/database';
import { fetchStockData, fetchDatabaseStats } from '@/services/stockService';
import DataExplorer from '@/components/DataExplorer';
import { DatabaseIcon, ServerIcon, BarChart2Icon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Database: React.FC = () => {
  const { toast } = useToast();
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'data' | 'stats'>('data');

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch stock data
      const data = await fetchStockData('RELIANCE.NS', 365);
      setStockData(data);
      
      // Fetch database stats
      const stats = await fetchDatabaseStats();
      setDbStats(stats);
      
      toast({
        title: "Data loaded successfully",
        description: "Database information has been updated.",
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "There was a problem fetching the database information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Database Explorer</h1>
              <p className="text-muted-foreground">
                View and interact with the stock prediction database
              </p>
            </div>
            <Button 
              onClick={loadData} 
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCwIcon size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh Data
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-8 px-4">
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="data" onClick={() => setCurrentView('data')}>
              <div className="flex items-center gap-2">
                <DatabaseIcon size={16} />
                Stock Data
              </div>
            </TabsTrigger>
            <TabsTrigger value="stats" onClick={() => setCurrentView('stats')}>
              <div className="flex items-center gap-2">
                <BarChart2Icon size={16} />
                Database Stats
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="space-y-6">
            <DataExplorer 
              data={stockData} 
              title="Stock Price Data" 
              description="Historical stock prices and prediction data for Reliance Industries"
            />
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ) : dbStats ? (
              <>
                {/* Database Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DatabaseIcon className="h-5 w-5 text-finance-primary" />
                        Database Size
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dbStats.databaseSize}</div>
                      <p className="text-sm text-muted-foreground mt-1">Total storage used</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ServerIcon className="h-5 w-5 text-green-600" />
                        Record Count
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{dbStats.totalRows.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground mt-1">Total database records</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart2Icon className="h-5 w-5 text-purple-600" />
                        Last Updated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-medium">
                        {new Date(dbStats.lastUpdated).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Database last refreshed</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Detailed Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Database Details</CardTitle>
                    <CardDescription>
                      Detailed information about the database structure and content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Stock Data Records</div>
                          <div className="text-2xl font-bold">{dbStats.stockDataCount.toLocaleString()}</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Prediction Records</div>
                          <div className="text-2xl font-bold">{dbStats.predictionCount.toLocaleString()}</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Model Versions</div>
                          <div className="text-2xl font-bold">{dbStats.modelsCount}</div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-2">Data Completeness</div>
                          <div className="text-2xl font-bold">
                            {((dbStats.stockDataCount / dbStats.totalRows) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Database Structure</h3>
                        <div className="bg-slate-800 text-slate-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                          <pre>{`
Database Name: reliance_stock_predictions
Tables:
  - stock_data (${dbStats.stockDataCount} rows)
  - predictions (${dbStats.predictionCount} rows)
  - model_info (${dbStats.modelsCount} rows)
  - prediction_metrics
  - training_logs

Relationships:
  - stock_data -> predictions (one-to-one)
  - model_info -> prediction_metrics (one-to-many)
  - model_info -> training_logs (one-to-many)
                          `}</pre>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Data Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Unable to load database statistics. Please try refreshing the data.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Database;
