
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
}

export interface ModelInfo {
  id?: number;
  modelVersion: string;
  trainDate: string;
  features: string[];
  algorithmType: string;
  hyperparameters: Record<string, any>;
  description: string;
}
