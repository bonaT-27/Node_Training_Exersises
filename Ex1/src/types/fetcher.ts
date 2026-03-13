// src/types/fetcher.ts

/**
 * Configuration for making HTTP requests
 */
export interface FetchConfig<T = unknown> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: T;
  timeout?: number; // Timeout in milliseconds
  retries?: number; // Number of retry attempts
}

/**
 * Standardized response structure
 */
export interface FetchResponse<T> {
  success: boolean;
  data?: T;
  error?: FetchError;
  status?: number; // HTTP status code
  timestamp: string; // When the response was received
}

/**
 * Detailed error information
 */
export interface FetchError {
  type: 'network' | 'http' | 'timeout' | 'abort' | 'validation';
  message: string;
  statusCode?: number;
  details?: unknown; // Additional error details
  retryCount?: number; // How many retries were attempted
}

/**
 * Interceptor functions for request/response transformation
 */
export interface Interceptors {
  request?: (config: FetchConfig) => FetchConfig | Promise<FetchConfig>;
  response?: <T>(response: FetchResponse<T>) => FetchResponse<T> | Promise<FetchResponse<T>>;
  error?: (error: FetchError) => FetchError | Promise<FetchError>;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of cached items
}

/**
 * Cache entry structure - MAKE SURE THIS IS EXPORTED
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}