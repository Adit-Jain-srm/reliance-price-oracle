
import { StockData, PredictionMetrics, ModelInfo, TrainingLog, DatabaseStats } from "@/types/database";

// Sample data for development (will be replaced by actual DB connection)
const generateMockData = (): StockData[] => {
  const baseDate = new Date("2020-01-01");  // Starting from 2020 for more data
  const data: StockData[] = [];
  let previousClose = 2500;
  
  for (let i = 0; i < 1000; i++) {  // Increased to 1000 data points
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    
    // Generate somewhat realistic stock price movements with more variability
    const volatility = Math.sin(i / 30) * 10 + 20; // Cyclical volatility
    const trendComponent = Math.sin(i / 180) * 200; // Long term trend cycles
    const randomComponent = (Math.random() - 0.48) * volatility;
    
    const change = randomComponent + (i % 20 === 0 ? (Math.random() > 0.5 ? 50 : -50) : 0) + (i / 1000) * trendComponent;
    const open = previousClose;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(1000000 + Math.random() * 5000000 + (i % 5 === 0 ? 2000000 : 0));
    
    // Add seasonal patterns
    const month = date.getMonth();
    const seasonalAdjustment = month >= 9 || month <= 1 ? 20 : month >= 3 && month <= 5 ? -15 : 0;
    
    // Generate prediction data - more realistic model predictions (higher accuracy for recent data)
    const daysFromEnd = 1000 - i;
    const accuracyFactor = Math.min(0.95, Math.max(0.7, 1 - daysFromEnd / 2000));
    const predictionError = (Math.random() - 0.5) * (30 * (1 - accuracyFactor));
    const predictedClose = close * (1 + predictionError / 100) + seasonalAdjustment;
    
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
      predictedClose: parseFloat(predictedClose.toFixed(2)),
      predictedDate: predictedDate.toISOString().split('T')[0],
      actualReturn: parseFloat(actualReturn.toFixed(2)),
      predictedReturn: parseFloat(predictedReturn.toFixed(2)),
      predictionAccuracy: parseFloat(predictionAccuracy.toFixed(2))
    });
    
    previousClose = close;
  }
  
  return data;
};

// Generate extended mock data
const mockStockData = generateMockData();

// Database connection configuration (mock for now)
const DB_CONFIG = {
  connected: true,
  type: 'mock', // 'mock', 'supabase', 'firebase'
  lastSynced: new Date().toISOString()
};

// Extended model metrics data with cross-validation to prevent overfitting
const mockModelMetrics: PredictionMetrics[] = [
  {
    id: 1,
    date: "2022-11-15",
    modelVersion: "RandomForest v1.0",
    rmse: 24.53,
    r2Score: 0.62,
    mape: 3.9,
    trainingDataSize: 650,
    testDataSize: 80,
    crossValidationScore: 0.59,
    lastUpdated: "2022-11-15T10:30:00Z"
  },
  {
    id: 2,
    date: "2023-01-10",
    modelVersion: "RandomForest v1.1",
    rmse: 18.87,
    r2Score: 0.68,
    mape: 3.4,
    trainingDataSize: 750,
    testDataSize: 100,
    crossValidationScore: 0.66,
    lastUpdated: "2023-01-10T12:15:00Z"
  },
  {
    id: 3,
    date: "2023-04-22",
    modelVersion: "RandomForest v1.2",
    rmse: 16.45,
    r2Score: 0.71,
    mape: 3.1,
    trainingDataSize: 850,
    testDataSize: 120,
    crossValidationScore: 0.69,
    lastUpdated: "2023-04-22T09:45:00Z"
  },
  {
    id: 4,
    date: "2023-07-18",
    modelVersion: "LSTM v1.0",
    rmse: 14.78,
    r2Score: 0.73,
    mape: 2.9,
    trainingDataSize: 900,
    testDataSize: 130,
    crossValidationScore: 0.71,
    lastUpdated: "2023-07-18T15:30:00Z"
  },
  {
    id: 5,
    date: "2023-10-05",
    modelVersion: "LSTM v1.1",
    rmse: 13.56,
    r2Score: 0.76,
    mape: 2.7,
    trainingDataSize: 950,
    testDataSize: 140,
    crossValidationScore: 0.74,
    lastUpdated: "2023-10-05T11:20:00Z"
  },
  {
    id: 6,
    date: "2023-12-15",
    modelVersion: "Ensemble v1.0",
    rmse: 12.34,
    r2Score: 0.78,
    mape: 2.3,
    trainingDataSize: 1100,
    testDataSize: 150,
    crossValidationScore: 0.76,
    lastUpdated: "2023-12-15T16:20:00Z"
  },
  {
    id: 7,
    date: "2024-01-10",
    modelVersion: "Ensemble v1.1",
    rmse: 11.45,
    r2Score: 0.81,
    mape: 2.1,
    trainingDataSize: 1250,
    testDataSize: 180,
    crossValidationScore: 0.79,
    lastUpdated: "2024-01-10T09:15:00Z"
  },
];

// Updated model info with anti-overfitting measures
const mockModelInfo: ModelInfo = {
  id: 1,
  modelVersion: "Ensemble v1.1",
  trainDate: "2024-01-10",
  features: [
    "Open", "High", "Low", "Close", "Volume", 
    "5_day_MA", "10_day_MA", "20_day_MA", "50_day_MA", 
    "RSI", "MACD", "Bollinger_Bands", "ATR", 
    "OBV", "Day_of_Week", "Month", "Quarter"
  ],
  algorithmType: "Ensemble (Random Forest + LSTM)",
  hyperparameters: {
    // Random Forest params
    rf_n_estimators: 200,
    rf_max_depth: 20,
    rf_min_samples_split: 5,
    rf_min_samples_leaf: 2,
    rf_bootstrap: true,
    rf_max_features: "auto",
    // LSTM params
    lstm_units: 50,
    lstm_dropout: 0.2,
    lstm_recurrent_dropout: 0.2,
    lstm_lookback: 30,
    // Training params
    batch_size: 32,
    epochs: 100,
    early_stopping_patience: 10,
    regularization_l2: 0.001
  },
  description: "An ensemble model combining Random Forest and LSTM neural networks to predict stock prices. The model includes extensive feature engineering with technical indicators and temporal features. Regularization and early stopping are implemented to prevent overfitting.",
  featureImportance: {
    "Close": 0.28,
    "Volume": 0.12,
    "20_day_MA": 0.10,
    "RSI": 0.09,
    "5_day_MA": 0.08,
    "MACD": 0.07,
    "10_day_MA": 0.06,
    "Bollinger_Bands": 0.05,
    "High": 0.04,
    "Low": 0.04,
    "ATR": 0.03,
    "OBV": 0.02,
    "Open": 0.01,
    "Day_of_Week": 0.005,
    "Month": 0.003,
    "Quarter": 0.002,
    "50_day_MA": 0.002
  },
  dataStartDate: "2020-01-01",
  dataEndDate: "2024-01-09",
  validationStrategy: "Time-based 5-fold cross-validation with rolling windows"
};

// Extended training logs
const mockTrainingLogs: TrainingLog[] = [
  {
    id: 1,
    date: "2022-11-15T10:15:00Z",
    modelVersion: "RandomForest v1.0",
    duration: 245,
    iterations: 100,
    notes: "Initial model training with basic features",
    status: "success"
  },
  {
    id: 2,
    date: "2022-12-10T14:20:00Z",
    modelVersion: "RandomForest v1.0-tuned",
    duration: 180,
    iterations: 80,
    notes: "Hyperparameter tuning with grid search",
    status: "failed",
    errorMessage: "Insufficient memory for large feature set"
  },
  {
    id: 3,
    date: "2023-01-10T09:30:00Z",
    modelVersion: "RandomForest v1.1",
    duration: 310,
    iterations: 150,
    notes: "Added technical indicators as features",
    status: "success"
  },
  {
    id: 4,
    date: "2023-04-22T16:00:00Z",
    modelVersion: "RandomForest v1.2",
    duration: 280,
    iterations: 200,
    notes: "Fine-tuned with cross-validation to prevent overfitting",
    status: "success"
  },
  {
    id: 5,
    date: "2023-07-18T08:45:00Z",
    modelVersion: "LSTM v1.0",
    duration: 520,
    iterations: 150,
    notes: "First deep learning model with LSTM architecture",
    status: "success"
  },
  {
    id: 6,
    date: "2023-09-05T11:30:00Z",
    modelVersion: "LSTM v1.0-reg",
    duration: 480,
    iterations: 120,
    notes: "Added regularization to prevent overfitting",
    status: "failed",
    errorMessage: "Vanishing gradient problem detected"
  },
  {
    id: 7,
    date: "2023-10-05T14:15:00Z",
    modelVersion: "LSTM v1.1",
    duration: 550,
    iterations: 180,
    notes: "Improved architecture with batch normalization",
    status: "success"
  },
  {
    id: 8,
    date: "2023-12-15T09:20:00Z",
    modelVersion: "Ensemble v1.0",
    duration: 680,
    iterations: 200,
    notes: "Combined RandomForest and LSTM models",
    status: "success"
  },
  {
    id: 9,
    date: "2024-01-10T08:45:00Z",
    modelVersion: "Ensemble v1.1",
    duration: 720,
    iterations: 250,
    notes: "Added more features and improved ensemble weighting",
    status: "success"
  }
];

// Enhanced database stats
const mockDatabaseStats: DatabaseStats = {
  totalRows: 3587,
  stockDataCount: 3250,
  predictionCount: 330,
  modelsCount: 7,
  lastUpdated: new Date().toISOString(),
  databaseSize: "48.5 MB",
  databaseType: DB_CONFIG.type,
  connectionStatus: DB_CONFIG.connected ? "Connected" : "Disconnected",
  lastSyncTime: DB_CONFIG.lastSynced
};

// API functions

export const getDatabaseConfig = async (): Promise<{
  connected: boolean;
  type: string;
  lastSynced: string;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DB_CONFIG);
    }, 300);
  });
};

export const connectToDatabase = async (type: string): Promise<boolean> => {
  // In a real app, this would connect to an actual database
  return new Promise((resolve) => {
    setTimeout(() => {
      DB_CONFIG.type = type;
      DB_CONFIG.connected = true;
      DB_CONFIG.lastSynced = new Date().toISOString();
      resolve(true);
    }, 1500);
  });
};

export const disconnectFromDatabase = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      DB_CONFIG.connected = false;
      resolve(true);
    }, 800);
  });
};

export const fetchStockData = async (symbol: string, days: number = 30): Promise<StockData[]> => {
  // In a real app, this would fetch from the connected database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStockData.slice(-days));
    }, 500);
  });
};

export const fetchAllStockData = async (symbol: string): Promise<StockData[]> => {
  // In a real app, this would fetch all data from the connected database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStockData);
    }, 800);
  });
};

export const fetchLatestPrice = async (symbol: string): Promise<StockData> => {
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const dates = mockStockData.slice(-60).map(d => d.date);
      const actual = mockStockData.slice(-60).map(d => d.close);
      const predicted = mockStockData.slice(-60).map(d => d.predictedClose || 0);
      
      resolve({ dates, actual, predicted });
    }, 600);
  });
};

export const fetchModelMetrics = async (): Promise<PredictionMetrics[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModelMetrics);
    }, 700);
  });
};

export const fetchModelDetails = async (): Promise<ModelInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModelInfo);
    }, 500);
  });
};

export const fetchTrainingLogs = async (): Promise<TrainingLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTrainingLogs);
    }, 600);
  });
};

export const fetchDatabaseStats = async (): Promise<DatabaseStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockDatabaseStats,
        lastUpdated: new Date().toISOString() // Update with current time
      });
    }, 400);
  });
};

// New functions for database interaction

export const runCustomQuery = async (query: string): Promise<any> => {
  // In a real app, this would execute a custom SQL query
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (query.toLowerCase().includes("select") && !query.toLowerCase().includes("drop")) {
        const sampleResults = mockStockData.slice(0, 5);
        resolve({
          status: "success",
          results: sampleResults,
          rowCount: 5
        });
      } else {
        reject({
          status: "error",
          message: "Only SELECT queries are allowed in demo mode"
        });
      }
    }, 1000);
  });
};

export const syncDatabaseWithAPI = async (): Promise<boolean> => {
  // In a real app, this would sync the database with external API data
  return new Promise((resolve) => {
    setTimeout(() => {
      DB_CONFIG.lastSynced = new Date().toISOString();
      resolve(true);
    }, 2000);
  });
};

