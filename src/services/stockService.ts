
import { StockData, PredictionMetrics, ModelInfo, TrainingLog, DatabaseStats } from "@/types/database";

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
    
    // Generate prediction data
    const predictedClose = parseFloat((close + (Math.random() - 0.45) * 25).toFixed(2));
    const predictedDate = new Date(date);
    predictedDate.setDate(date.getDate() + 1);
    
    // Calculate returns and accuracy
    const actualReturn = i > 0 ? ((close - data[i-1].close) / data[i-1].close) * 100 : 0;
    const predictedReturn = i > 0 ? ((predictedClose - data[i-1].close) / data[i-1].close) * 100 : 0;
    const predictionAccuracy = 100 - Math.abs(predictedReturn - actualReturn);
    
    data.push({
      id: i + 1,
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
      symbol: "RELIANCE.NS",
      predictedClose,
      predictedDate: predictedDate.toISOString().split('T')[0],
      actualReturn: parseFloat(actualReturn.toFixed(2)),
      predictedReturn: parseFloat(predictedReturn.toFixed(2)),
      predictionAccuracy: parseFloat(predictionAccuracy.toFixed(2))
    });
    
    previousClose = close;
  }
  
  return data;
};

// Mock data for development
const mockStockData = generateMockData();

// Mock model metrics data
const mockModelMetrics: PredictionMetrics[] = [
  {
    id: 1,
    date: "2023-11-15",
    modelVersion: "RandomForest v1.0",
    rmse: 14.23,
    r2Score: 0.72,
    mape: 2.8,
    trainingDataSize: 950,
    testDataSize: 100,
    crossValidationScore: 0.69,
    lastUpdated: "2023-11-15T10:30:00Z"
  },
  {
    id: 2,
    date: "2023-12-01",
    modelVersion: "RandomForest v1.1",
    rmse: 12.87,
    r2Score: 0.75,
    mape: 2.5,
    trainingDataSize: 1000,
    testDataSize: 120,
    crossValidationScore: 0.73,
    lastUpdated: "2023-12-01T14:45:00Z"
  },
  {
    id: 3,
    date: "2023-12-15",
    modelVersion: "RandomForest v1.2",
    rmse: 12.34,
    r2Score: 0.78,
    mape: 2.3,
    trainingDataSize: 1100,
    testDataSize: 150,
    crossValidationScore: 0.76,
    lastUpdated: "2023-12-15T16:20:00Z"
  },
  {
    id: 4,
    date: "2024-01-10",
    modelVersion: "RandomForest v1.3",
    rmse: 11.45,
    r2Score: 0.81,
    mape: 2.1,
    trainingDataSize: 1250,
    testDataSize: 180,
    crossValidationScore: 0.79,
    lastUpdated: "2024-01-10T09:15:00Z"
  },
];

// Mock model info
const mockModelInfo: ModelInfo = {
  id: 1,
  modelVersion: "RandomForest v1.3",
  trainDate: "2024-01-10",
  features: ["Open", "High", "Low", "Close", "Volume", "5_day_MA", "10_day_MA", "RSI", "MACD"],
  algorithmType: "Random Forest Regressor",
  hyperparameters: {
    n_estimators: 200,
    max_depth: 20,
    min_samples_split: 5,
    min_samples_leaf: 2,
    bootstrap: true,
    max_features: "auto"
  },
  description: "An ensemble learning model that uses multiple decision trees to predict stock prices based on historical data and technical indicators. This version includes improved feature engineering with moving averages and oscillators.",
  featureImportance: {
    "Close": 0.35,
    "Volume": 0.15,
    "5_day_MA": 0.12,
    "10_day_MA": 0.10,
    "RSI": 0.08,
    "High": 0.07,
    "Low": 0.06,
    "Open": 0.05,
    "MACD": 0.02
  },
  dataStartDate: "2020-01-01",
  dataEndDate: "2024-01-09"
};

// Mock training logs
const mockTrainingLogs: TrainingLog[] = [
  {
    id: 1,
    date: "2023-11-15T10:15:00Z",
    modelVersion: "RandomForest v1.0",
    duration: 245,
    iterations: 100,
    notes: "Initial model training with basic features",
    status: "success"
  },
  {
    id: 2,
    date: "2023-11-25T14:20:00Z",
    modelVersion: "RandomForest v1.1-beta",
    duration: 180,
    iterations: 80,
    notes: "Testing hyperparameter adjustments",
    status: "failed",
    errorMessage: "Insufficient memory for large feature set"
  },
  {
    id: 3,
    date: "2023-12-01T09:30:00Z",
    modelVersion: "RandomForest v1.1",
    duration: 310,
    iterations: 150,
    notes: "Added technical indicators as features",
    status: "success"
  },
  {
    id: 4,
    date: "2023-12-15T16:00:00Z",
    modelVersion: "RandomForest v1.2",
    duration: 280,
    iterations: 200,
    notes: "Fine-tuned hyperparameters based on cross-validation",
    status: "success"
  },
  {
    id: 5,
    date: "2024-01-10T08:45:00Z",
    modelVersion: "RandomForest v1.3",
    duration: 420,
    iterations: 250,
    notes: "Increased training data and added more technical indicators",
    status: "success"
  }
];

// Mock database stats
const mockDatabaseStats: DatabaseStats = {
  totalRows: 1587,
  stockDataCount: 1250,
  predictionCount: 330,
  modelsCount: 4,
  lastUpdated: new Date().toISOString(),
  databaseSize: "24.5 MB"
};

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

export const fetchModelMetrics = async (): Promise<PredictionMetrics[]> => {
  // In a real app, this would fetch from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModelMetrics);
    }, 700);
  });
};

export const fetchModelDetails = async (): Promise<ModelInfo> => {
  // In a real app, this would fetch from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModelInfo);
    }, 500);
  });
};

export const fetchTrainingLogs = async (): Promise<TrainingLog[]> => {
  // In a real app, this would fetch from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTrainingLogs);
    }, 600);
  });
};

export const fetchDatabaseStats = async (): Promise<DatabaseStats> => {
  // In a real app, this would fetch from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockDatabaseStats,
        lastUpdated: new Date().toISOString() // Update with current time
      });
    }, 400);
  });
};
