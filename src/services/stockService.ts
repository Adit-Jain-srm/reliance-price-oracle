import { StockData, PredictionMetrics, ModelInfo, TrainingLog, DatabaseStats, DatabaseQueryResult } from "@/types/database";

// Using Alpha Vantage API for real-time stock data
// Free API key for demo purposes (limited to 5 requests per minute, 500 per day)
const API_KEY = "demo"; // Use "demo" for testing, replace with your API key for production
const ALPHA_VANTAGE_API = "https://www.alphavantage.co/query";

// Maintain existing model metrics until we integrate with a real ML API
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

// Keep existing model info until we have a real ML model
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

// Training logs - will be replaced by actual training logs in production
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

// Database connection configuration
const DB_CONFIG = {
  connected: true,
  type: 'alphavantage', // Using Alpha Vantage API
  lastSynced: new Date().toISOString()
};

// Enhanced database stats - will be updated with real data counts
const mockDatabaseStats: DatabaseStats = {
  totalRows: 0, // Will be updated after data fetch
  stockDataCount: 0, // Will be updated after data fetch
  predictionCount: 0,
  modelsCount: 7,
  lastUpdated: new Date().toISOString(),
  databaseSize: "Real-time API",
  databaseType: DB_CONFIG.type,
  connectionStatus: DB_CONFIG.connected ? "Connected" : "Disconnected",
  lastSyncTime: DB_CONFIG.lastSynced
};

// Cache for stock data to reduce API calls
const stockDataCache: Record<string, {
  data: StockData[],
  timestamp: number,
  symbol: string
}> = {};

// Cache expiration time in milliseconds (15 minutes)
const CACHE_EXPIRATION = 15 * 60 * 1000;

// Fetch stock data from Alpha Vantage API
const fetchStockDataFromAPI = async (symbol: string, outputSize: string = "compact"): Promise<StockData[]> => {
  try {
    // Set up query parameters for Alpha Vantage API
    const params = new URLSearchParams({
      function: "TIME_SERIES_DAILY",
      symbol,
      outputsize: outputSize, // 'compact' returns the latest 100 data points, 'full' returns up to 20 years
      apikey: API_KEY
    });

    // Log the request URL for debugging
    console.log(`Fetching data from: ${ALPHA_VANTAGE_API}?${params.toString()}`);
    
    // Make the API request
    const response = await fetch(`${ALPHA_VANTAGE_API}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API error responses
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('Alpha Vantage API limit note:', data['Note']);
    }
    
    if (!data['Time Series (Daily)']) {
      throw new Error('No daily time series data returned from API');
    }
    
    // Transform Alpha Vantage data format to our StockData format
    const timeSeriesData = data['Time Series (Daily)'];
    const stockData: StockData[] = Object.entries(timeSeriesData).map(([date, values]: [string, any], index) => {
      return {
        id: index + 1,
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'], 10),
        symbol
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending
    
    // Generate predictions
    const predictedData = generatePredictions(stockData);
    
    // Update database stats
    mockDatabaseStats.totalRows = predictedData.length;
    mockDatabaseStats.stockDataCount = predictedData.length;
    mockDatabaseStats.lastUpdated = new Date().toISOString();
    
    return predictedData;
  } catch (error) {
    console.error('Error fetching stock data from API:', error);
    throw error;
  }
};

// Generate predictions based on actual data
// In a real app, this would be a call to your ML model API
const generatePredictions = (stockData: StockData[]): StockData[] => {
  return stockData.map((item, index) => {
    if (index === 0) return item;
    
    // Use simple moving average for demonstration
    // In production, this would be replaced by actual ML predictions
    const predictedClose = calculateSimpleMovingAverage(
      stockData.slice(Math.max(0, index - 5), index).map(d => d.close)
    );
    
    const actualReturn = ((item.close - stockData[index - 1].close) / stockData[index - 1].close) * 100;
    const predictedReturn = ((predictedClose - stockData[index - 1].close) / stockData[index - 1].close) * 100;
    const predictionAccuracy = 100 - Math.abs(predictedReturn - actualReturn);
    
    const nextDay = new Date(item.date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return {
      ...item,
      predictedClose,
      predictedDate: nextDay.toISOString().split('T')[0],
      actualReturn,
      predictedReturn,
      predictionAccuracy
    };
  });
};

// Calculate simple moving average
const calculateSimpleMovingAverage = (prices: number[]): number => {
  if (prices.length === 0) return 0;
  const sum = prices.reduce((acc, price) => acc + price, 0);
  return parseFloat((sum / prices.length).toFixed(2));
};

// API functions

export const getDatabaseConfig = async (): Promise<{
  connected: boolean;
  type: string;
  lastSynced: string;
}> => {
  return Promise.resolve(DB_CONFIG);
};

export const connectToDatabase = async (type: string): Promise<boolean> => {
  DB_CONFIG.type = type;
  DB_CONFIG.connected = true;
  DB_CONFIG.lastSynced = new Date().toISOString();
  return Promise.resolve(true);
};

export const disconnectFromDatabase = async (): Promise<boolean> => {
  DB_CONFIG.connected = false;
  return Promise.resolve(true);
};

export const fetchStockData = async (symbol: string, days: number = 90): Promise<StockData[]> => {
  try {
    // Check if we have valid cached data
    const cacheKey = `${symbol}_${days}`;
    const cachedData = stockDataCache[cacheKey];
    const now = Date.now();
    
    if (cachedData && now - cachedData.timestamp < CACHE_EXPIRATION) {
      console.log('Using cached stock data');
      return cachedData.data.slice(-days);
    }
    
    // Determine appropriate outputsize based on days
    let outputSize = "compact"; // Default to compact (100 data points)
    if (days > 100) outputSize = "full"; // Switch to full for more data
    
    // Convert Indian symbol format if needed
    const apiSymbol = symbol.replace('.NS', '');
    
    // Fetch fresh data
    const data = await fetchStockDataFromAPI(apiSymbol, outputSize);
    
    // Cache the data
    stockDataCache[cacheKey] = {
      data,
      timestamp: now,
      symbol
    };
    
    return data.slice(-days);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const fetchAllStockData = async (symbol: string): Promise<StockData[]> => {
  try {
    return await fetchStockData(symbol, 1000); // Get as much data as possible
  } catch (error) {
    console.error('Error fetching all stock data:', error);
    throw error;
  }
};

export const fetchLatestPrice = async (symbol: string): Promise<StockData> => {
  try {
    const data = await fetchStockData(symbol, 1);
    return data[data.length - 1];
  } catch (error) {
    console.error('Error fetching latest price:', error);
    throw error;
  }
};

export const fetchPrediction = async (symbol: string): Promise<{
  currentPrice: number;
  predictedPrice: number;
  predictedChange: number;
  predictedDate: string;
}> => {
  try {
    const data = await fetchStockData(symbol, 10);
    const latestData = data[data.length - 1];
    
    // Calculate prediction using simple model
    // In production, this would call your ML API
    const prices = data.map(d => d.close);
    const predictedPrice = calculateSimpleMovingAverage(prices) * (1 + (Math.random() * 0.04 - 0.02));
    
    const tomorrow = new Date(latestData.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      currentPrice: latestData.close,
      predictedPrice: parseFloat(predictedPrice.toFixed(2)),
      predictedChange: parseFloat(((predictedPrice - latestData.close) / latestData.close * 100).toFixed(2)),
      predictedDate: tomorrow.toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
};

export const getHistoricalPredictions = async (symbol: string = "RELIANCE.NS"): Promise<{
  dates: string[];
  actual: number[];
  predicted: number[];
}> => {
  try {
    // Get data with predictions
    const data = await fetchStockData(symbol, 60);
    
    // Filter out entries without predictions
    const validData = data.filter(d => d.predictedClose !== undefined);
    
    return {
      dates: validData.map(d => d.date),
      actual: validData.map(d => d.close),
      predicted: validData.map(d => d.predictedClose || 0)
    };
  } catch (error) {
    console.error('Error fetching historical predictions:', error);
    throw error;
  }
};

export const fetchModelMetrics = async (): Promise<PredictionMetrics[]> => {
  // In a real app, this would fetch from your ML service
  return Promise.resolve(mockModelMetrics);
};

export const fetchModelDetails = async (): Promise<ModelInfo> => {
  // In a real app, this would fetch from your ML service
  return Promise.resolve(mockModelInfo);
};

export const fetchTrainingLogs = async (): Promise<TrainingLog[]> => {
  // In a real app, this would fetch from your ML service
  return Promise.resolve(mockTrainingLogs);
};

export const fetchDatabaseStats = async (): Promise<DatabaseStats> => {
  return Promise.resolve({
    ...mockDatabaseStats,
    lastUpdated: new Date().toISOString() // Update with current time
  });
};

// Database interaction functions

export const runCustomQuery = async (query: string): Promise<DatabaseQueryResult> => {
  // In a real app, this would execute against your database
  if (query.toLowerCase().includes("select") && !query.toLowerCase().includes("drop")) {
    try {
      const symbol = "RELIANCE.NS";
      const data = await fetchStockData(symbol, 5);
      
      return {
        status: "success",
        results: data,
        rowCount: data.length
      };
    } catch (error) {
      return {
        status: "error",
        message: `Error executing query: ${error}`
      };
    }
  } else {
    return {
      status: "error",
      message: "Only SELECT queries are allowed"
    };
  }
};

export const syncDatabaseWithAPI = async (): Promise<boolean> => {
  try {
    // Clear cache to force refresh on next fetch
    Object.keys(stockDataCache).forEach(key => {
      delete stockDataCache[key];
    });
    
    DB_CONFIG.lastSynced = new Date().toISOString();
    return true;
  } catch (error) {
    console.error('Error syncing database with API:', error);
    throw error;
  }
};
