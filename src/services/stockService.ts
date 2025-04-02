
import { StockData } from "@/types/database";

// Sample data for development (will be replaced by API or database calls)
const generateMockData = (): StockData[] => {
  const baseDate = new Date("2023-01-01");
  const data: StockData[] = [];
  let previousClose = 2500;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    
    // Generate somewhat realistic stock price movements
    const change = (Math.random() - 0.48) * 30;
    const open = previousClose;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 15;
    const low = Math.min(open, close) - Math.random() * 15;
    const volume = Math.floor(1000000 + Math.random() * 5000000);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      symbol: "RELIANCE.NS",
      predictedClose: parseFloat((close + (Math.random() - 0.45) * 25).toFixed(2))
    });
    
    previousClose = close;
  }
  
  return data;
};

// Mock data for development
const mockStockData = generateMockData();

export const fetchStockData = async (symbol: string, days: number = 30): Promise<StockData[]> => {
  // In a real app, this would fetch from an API or database
  // For now, we'll use our mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStockData.slice(-days));
    }, 500); // Simulate network delay
  });
};

export const fetchLatestPrice = async (symbol: string): Promise<StockData> => {
  // In a real app, this would fetch from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStockData[mockStockData.length - 1]);
    }, 300);
  });
};

export const fetchPrediction = async (symbol: string): Promise<{
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  predictedDate: string;
}> => {
  // In a real app, this would run the ML model or fetch prediction from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      const latestData = mockStockData[mockStockData.length - 1];
      const predictedPrice = latestData.close * (1 + (Math.random() * 0.04 - 0.02));
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      resolve({
        currentPrice: latestData.close,
        predictedPrice: parseFloat(predictedPrice.toFixed(2)),
        predictedChange: parseFloat(((predictedPrice - latestData.close) / latestData.close * 100).toFixed(2)),
        predictedDate: tomorrow.toISOString().split('T')[0]
      });
    }, 800);
  });
};

export const getHistoricalPredictions = async (): Promise<{
  dates: string[];
  actual: number[];
  predicted: number[];
}> => {
  // In a real app, this would fetch from the database
  return new Promise((resolve) => {
    setTimeout(() => {
      const dates = mockStockData.slice(-30).map(d => d.date);
      const actual = mockStockData.slice(-30).map(d => d.close);
      const predicted = mockStockData.slice(-30).map(d => d.predictedClose || 0);
      
      resolve({ dates, actual, predicted });
    }, 600);
  });
};
