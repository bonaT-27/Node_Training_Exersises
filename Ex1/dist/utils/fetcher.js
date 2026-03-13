"use strict";
// src/utils/fetcher.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFetcher = exports.DataFetcher = void 0;
/**
 * Main data fetching class with retry logic, caching, and interceptors
 */
class DataFetcher {
    constructor(interceptors, cacheConfig) {
        this.interceptors = {};
        this.cache = new Map();
        this.pendingRequests = new Map();
        this.cacheConfig = {
            enabled: false,
            ttl: 5 * 60 * 1000, // 5 minutes default
            maxSize: 100
        };
        if (interceptors) {
            this.interceptors = interceptors;
        }
        if (cacheConfig) {
            this.cacheConfig = { ...this.cacheConfig, ...cacheConfig };
        }
    }
    /**
     * Generate cache key from request config
     */
    getCacheKey(config) {
        return `${config.method || 'GET'}-${config.url}-${JSON.stringify(config.body || {})}`;
    }
    /**
     * Clean expired cache entries
     */
    cleanCache() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (entry.expiresAt < now) {
                this.cache.delete(key);
            }
        }
    }
    /**
     * Add item to cache
     */
    setCacheEntry(key, data) {
        if (!this.cacheConfig.enabled)
            return;
        // Clean cache if it exceeds max size
        if (this.cacheConfig.maxSize && this.cache.size >= this.cacheConfig.maxSize) {
            // Get the first key safely
            const firstKey = Array.from(this.cache.keys())[0];
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
        const now = Date.now();
        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt: now + this.cacheConfig.ttl
        });
    }
    /**
     * Get item from cache
     */
    getCacheEntry(key) {
        if (!this.cacheConfig.enabled)
            return undefined;
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        if (entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.data;
    }
    /**
     * Calculate delay for exponential backoff
     */
    calculateBackoff(attempt) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const baseDelay = 1000; // 1 second
        return Math.min(baseDelay * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
    }
    /**
     * Execute fetch with timeout
     */
    async fetchWithTimeout(url, options, timeoutMs = 5000) {
        const controller = new AbortController();
        const { signal } = controller;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                ...options,
                signal
            });
            clearTimeout(timeoutId);
            return response;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error && error.name === 'AbortError') {
                throw { type: 'timeout', message: `Request timeout after ${timeoutMs}ms` };
            }
            throw error;
        }
    }
    /**
     * Process request interceptors
     */
    async processRequestInterceptors(config) {
        let processedConfig = { ...config };
        if (this.interceptors.request) {
            processedConfig = await this.interceptors.request(processedConfig);
        }
        return processedConfig;
    }
    /**
     * Process response interceptors
     */
    async processResponseInterceptors(response) {
        let processedResponse = { ...response };
        if (this.interceptors.response) {
            processedResponse = await this.interceptors.response(processedResponse);
        }
        return processedResponse;
    }
    /**
     * Process error interceptors
     */
    async processErrorInterceptors(error) {
        let processedError = { ...error };
        if (this.interceptors.error) {
            processedError = await this.interceptors.error(processedError);
        }
        return processedError;
    }
    /**
     * Main fetch function with retry logic and error handling
     */
    async fetchData(config, abortSignal) {
        const { url, method = 'GET', headers = {}, body, timeout = 5000, retries = 3 } = await this.processRequestInterceptors(config);
        // Check cache for GET requests
        const cacheKey = this.getCacheKey(config);
        if (method === 'GET') {
            const cachedData = this.getCacheEntry(cacheKey);
            if (cachedData) {
                return {
                    success: true,
                    data: cachedData,
                    timestamp: new Date().toISOString()
                };
            }
        }
        // Check for duplicate pending requests
        if (method === 'GET' && this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }
        // Prepare request options
        const requestOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            signal: abortSignal
        };
        if (body && method !== 'GET') {
            requestOptions.body = JSON.stringify(body);
        }
        let lastError;
        let attempt = 0;
        // Create the fetch promise with retry logic
        const fetchPromise = (async () => {
            while (attempt <= retries) {
                attempt++;
                try {
                    // Execute fetch with timeout
                    const response = await this.fetchWithTimeout(url, requestOptions, timeout);
                    // Parse response
                    let responseData;
                    const contentType = response.headers.get('content-type');
                    if (contentType?.includes('application/json')) {
                        responseData = await response.json();
                    }
                    else {
                        responseData = (await response.text());
                    }
                    // Handle HTTP errors
                    if (!response.ok) {
                        const error = {
                            type: 'http',
                            message: `HTTP error ${response.status}: ${response.statusText}`,
                            statusCode: response.status,
                            retryCount: attempt - 1
                        };
                        throw error;
                    }
                    // Success response
                    const successResponse = {
                        success: true,
                        data: responseData,
                        status: response.status,
                        timestamp: new Date().toISOString()
                    };
                    // Cache successful GET responses
                    if (method === 'GET') {
                        this.setCacheEntry(cacheKey, responseData);
                    }
                    return await this.processResponseInterceptors(successResponse);
                }
                catch (error) {
                    // Classify error type
                    let fetchError;
                    // Check if it's our custom error object
                    if (error && typeof error === 'object' && 'type' in error) {
                        fetchError = error;
                    }
                    // Check for network errors
                    else if (error instanceof TypeError && error.message === 'Failed to fetch') {
                        fetchError = {
                            type: 'network',
                            message: 'Network connection failed',
                            retryCount: attempt - 1
                        };
                    }
                    // Check for abort errors
                    else if (error instanceof Error && error.name === 'AbortError') {
                        fetchError = {
                            type: 'abort',
                            message: 'Request was cancelled',
                            retryCount: attempt - 1
                        };
                    }
                    // Other errors
                    else {
                        fetchError = {
                            type: 'validation',
                            message: error instanceof Error ? error.message : 'Unknown error occurred',
                            retryCount: attempt - 1
                        };
                    }
                    lastError = await this.processErrorInterceptors(fetchError);
                    // If we've exhausted retries, return error
                    if (attempt > retries) {
                        return {
                            success: false,
                            error: lastError,
                            timestamp: new Date().toISOString()
                        };
                    }
                    // Calculate delay for retry
                    const delay = this.calculateBackoff(attempt);
                    console.log(`Retry attempt ${attempt}/${retries} after ${delay}ms`);
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            // This should never be reached due to the return in the catch block
            return {
                success: false,
                error: lastError,
                timestamp: new Date().toISOString()
            };
        })();
        // Store pending request for GET requests
        if (method === 'GET') {
            this.pendingRequests.set(cacheKey, fetchPromise);
            // Clean up after request completes
            fetchPromise.finally(() => {
                this.pendingRequests.delete(cacheKey);
            });
        }
        return fetchPromise;
    }
    /**
     * Cancel all pending requests
     */
    cancelAllRequests() {
        // Note: Actual AbortController instances are managed per request
        // This would need to be implemented with a controller registry
        console.log('Cancelling all pending requests...');
        this.pendingRequests.clear();
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache stats
     */
    getCacheStats() {
        this.cleanCache();
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
exports.DataFetcher = DataFetcher;
// Export a default instance
exports.defaultFetcher = new DataFetcher();
