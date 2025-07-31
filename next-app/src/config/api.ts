// API Configuration
export const API_CONFIG = {
  // Backend URL - change this to your backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Whether to use mock data as fallback when API is unavailable
  USE_MOCK_FALLBACK: true,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API status
export const API_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  LOADING: 'loading',
  ERROR: 'error',
} as const;

export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS]; 