
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import StockChart from '@/components/StockChart';
import StockSummary from '@/components/StockSummary';
import PricePrediction from '@/components/PricePrediction';
import ModelMetrics from '@/components/ModelMetrics';
import PredictionAccuracy from '@/components/PredictionAccuracy';
import { 
  fetchStockData, 
  fetchLatestPrice, 
  fetchPrediction,
  getHistoricalPredictions
} from '@/services/stockService';
import { StockData } from '@/types/database';

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
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch stock data
      const data = await fetchStockData('RELIANCE.NS', 365);
      setStockData(data);
      
      // Fetch latest price
      const latest = await fetchLatestPrice('RELIANCE.NS');
      setLatestPrice(latest);
      
      // Fetch prediction
      const pred = await fetchPrediction('RELIANCE.NS');
      setPrediction(pred);
      
      // Fetch historical predictions
      const history = await getHistoricalPredictions();
      setPredictionHistory(history);
      
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        stockName="Reliance Industries Ltd."
        currentPrice={latestPrice?.close || 0}
        previousClose={latestPrice?.open || 0}
        onRefresh={loadData}
        isLoading={isLoading}
      />
      
      <main className="container py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <StockChart 
              data={stockData} 
              title="Reliance Stock Price (RELIANCE.NS)" 
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
              modelVersion="RandomForest v1.2"
              trainDate="2023-03-15"
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4 mt-10">
        <div className="container text-center text-sm text-gray-500">
          <p>Reliance Price Oracle - Machine Learning Prediction Model</p>
          <p className="mt-1">Data is for demonstration purposes only. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
