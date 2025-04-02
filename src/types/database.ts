
export interface StockData {
  id?: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  symbol: string;
  predictedClose?: number;
  predictedDate?: string;
  actualReturn?: number;
  predictedReturn?: number;
  predictionAccuracy?: number;
}

export interface PredictionMetrics {
  id?: number;
  date: string;
  modelVersion: string;
  rmse: number;
  r2Score: number;
  mape?: number; // Mean Absolute Percentage Error
  trainingDataSize?: number; // Size of dataset used for training
  testDataSize?: number; // Size of test dataset
  crossValidationScore?: number; // Cross-validation score
  lastUpdated: string; // When the metrics were last updated
}

export interface ModelInfo {
  id?: number;
  modelVersion: string;
  trainDate: string;
  features: string[];
  algorithmType: string;
  hyperparameters: Record<string, any>;
  description: string;
  featureImportance?: Record<string, number>; // Feature importance scores
  dataStartDate?: string; // Start date of training data
  dataEndDate?: string; // End date of training data
}

export interface TrainingLog {
  id?: number;
  date: string;
  modelVersion: string;
  duration: number; // Time taken to train in seconds
  iterations: number; // Number of iterations/epochs
  notes?: string; // Any notes about this training run
  status: 'success' | 'failed' | 'in_progress';
  errorMessage?: string; // Error message if failed
}

export interface DatabaseStats {
  totalRows: number;
  stockDataCount: number;
  predictionCount: number;
  modelsCount: number;
  lastUpdated: string;
  databaseSize: string; // Size of the database in MB/GB
}
