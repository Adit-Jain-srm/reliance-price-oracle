
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import StockChart from '@/components/StockChart';
import StockSummary from '@/components/StockSummary';
import PricePrediction from '@/components/PricePrediction';
import ModelMetrics from '@/components/ModelMetrics';
import PredictionAccuracy from '@/components/PredictionAccuracy';
import ModelInfo from '@/components/ModelInfo';
import { 
  fetchStockData, 
  fetchLatestPrice, 
  fetchPrediction,
  getHistoricalPredictions,
  fetchModelDetails
} from '@/services/stockService';
import { StockData, ModelInfo as ModelInfoType } from '@/types/database';
import { DatabaseIcon, BarChart2Icon, TrendingUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [latestPrice, setLatestPrice] = useState<StockData | null>(null);
  const [prediction, setPrediction] = useState<{
    currentPrice: number;
    predictedPrice: number;
    predictedChange: number;
    predictedDate: string;
  } | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<{
    dates: string[];
    actual: number[];
    predicted: number[];
  } | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Default to IBM as it's available in the Alpha Vantage demo API
  const [stockSymbol, setStockSymbol] = useState("IBM"); 

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch stock data
      const data = await fetchStockData(stockSymbol, 100);
      setStockData(data);
      
      // Fetch latest price
      const latest = await fetchLatestPrice(stockSymbol);
      setLatestPrice(latest);
      
      // Fetch prediction
      const pred = await fetchPrediction(stockSymbol);
      setPrediction(pred);
      
      // Fetch historical predictions
      const history = await getHistoricalPredictions(stockSymbol);
      setPredictionHistory(history);
      
      // Fetch model info
      const model = await fetchModelDetails();
      setModelInfo(model);
      
      toast({
        title: "Data loaded successfully",
        description: "Latest market data and predictions have been updated.",
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "There was a problem fetching the latest data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [stockSymbol]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header 
        stockName={`${stockSymbol} - Stock Analysis`}
        currentPrice={latestPrice?.close || 0}
        previousClose={latestPrice?.open || 0}
        onRefresh={loadData}
        isLoading={isLoading}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/database">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-finance-primary hover:shadow-lg transition-shadow flex items-center gap-3">
              <DatabaseIcon className="h-10 w-10 p-2 bg-finance-primary/10 rounded-lg text-finance-primary" />
              <div>
                <h3 className="font-medium">Database Explorer</h3>
                <p className="text-sm text-muted-foreground">Browse and analyze stock data</p>
              </div>
            </div>
          </Link>
          
          <Link to="/model">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-finance-secondary hover:shadow-lg transition-shadow flex items-center gap-3">
              <BarChart2Icon className="h-10 w-10 p-2 bg-finance-secondary/10 rounded-lg text-finance-secondary" />
              <div>
                <h3 className="font-medium">Model Details</h3>
                <p className="text-sm text-muted-foreground">ML model metrics and performance</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-finance-accent hover:shadow-lg transition-shadow flex items-center gap-3">
            <TrendingUpIcon className="h-10 w-10 p-2 bg-finance-accent/10 rounded-lg text-finance-accent" />
            <div>
              <h3 className="font-medium">Market Dashboard</h3>
              <p className="text-sm text-muted-foreground">Current view and predictions</p>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <StockChart 
              data={stockData} 
              title={`${stockSymbol} Stock Price`} 
            />
            
            {predictionHistory && (
              <PredictionAccuracy data={predictionHistory} />
            )}
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <StockSummary data={latestPrice} isLoading={isLoading} />
            
            {prediction && (
              <PricePrediction 
                currentPrice={prediction.currentPrice}
                predictedPrice={prediction.predictedPrice}
                predictedChange={prediction.predictedChange}
                predictedDate={prediction.predictedDate}
                isLoading={isLoading}
              />
            )}
            
            <ModelMetrics 
              rmse={12.34}
              r2Score={0.78}
              modelVersion="RandomForest v1.3"
              trainDate="2024-01-10"
            />
            
            {modelInfo && (
              <div className="pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/model">View Model Details</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p className="font-medium text-base mb-1">Stock Price Oracle - Machine Learning Prediction Model</p>
          <p className="mb-3">Data is for demonstration purposes only. Not financial advice.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/" className="text-finance-primary hover:underline">Dashboard</Link>
            <Link to="/database" className="text-finance-primary hover:underline">Database</Link>
            <Link to="/model" className="text-finance-primary hover:underline">Model Info</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
