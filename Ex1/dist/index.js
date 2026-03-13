"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFetcher = exports.fetcher = void 0;
const fetcher_1 = require("./utils/fetcher");
Object.defineProperty(exports, "DataFetcher", { enumerable: true, get: function () { return fetcher_1.DataFetcher; } });
const mockData_1 = require("./mockData");
// Simulate an API server with delays and potential failures
class MockServer {
    constructor() {
        this.delay = 500; // Base delay in ms
        this.failureRate = 0.2; // 20% chance of failure
    }
    async handleRequest(endpoint, data, customDelay, forceFail) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, customDelay || this.delay));
        // Simulate random failures
        if (forceFail || Math.random() < this.failureRate) {
            throw new Error('Simulated server error');
        }
        return data;
    }
}
const server = new MockServer();
// Custom fetcher with interceptors
const loggingInterceptor = {
    request: async (config) => {
        console.log(`🚀 Request: ${config.method || 'GET'} ${config.url}`);
        return config;
    },
    response: async (response) => {
        if (response.success) {
            console.log(`✅ Response received at ${response.timestamp}`);
        }
        return response;
    },
    error: async (error) => {
        console.error(`❌ Error: ${error.type} - ${error.message}`);
        return error;
    }
};
// Create fetcher instances
const fetcher = new fetcher_1.DataFetcher(loggingInterceptor, {
    enabled: true,
    ttl: 10000 // 10 seconds cache
});
exports.fetcher = fetcher;
/**
 * Example 1: Basic GET request
 */
async function exampleBasicGet() {
    console.log('\n=== Example 1: Basic GET Request ===');
    const config = {
        url: '/api/users',
        method: 'GET',
        timeout: 3000,
        retries: 2
    };
    const response = await fetcher.fetchData(config);
    if (response.success) {
        console.log('Users:', response.data);
    }
    else {
        console.error('Failed to fetch users:', response.error);
    }
}
/**
 * Example 2: POST request with body
 */
async function examplePost() {
    console.log('\n=== Example 2: POST Request ===');
    const newOrder = {
        name: "New Dish",
        orderNumber: 999,
        date: new Date().toISOString().split('T')[0],
        hotel: "Test Hotel",
        price: 100,
        currency: "ETB",
        userId: 14
    };
    const config = {
        url: '/api/orders',
        method: 'POST',
        body: newOrder,
        timeout: 5000
    };
    const response = await fetcher.fetchData(config);
    if (response.success) {
        console.log('Order created:', response.data);
        console.log('Status:', response.status);
    }
}
/**
 * Example 3: Error handling and retries
 */
async function exampleErrorHandling() {
    console.log('\n=== Example 3: Error Handling with Retries ===');
    // This will fail and trigger retries
    const config = {
        url: '/api/failing-endpoint',
        method: 'GET',
        timeout: 1000,
        retries: 3
    };
    const response = await fetcher.fetchData(config);
    if (!response.success && response.error) {
        console.log('Error type:', response.error.type);
        console.log('Error message:', response.error.message);
        console.log('Retries attempted:', response.error.retryCount);
    }
}
/**
 * Example 4: Caching demonstration
 */
async function exampleCaching() {
    console.log('\n=== Example 4: Caching Demonstration ===');
    // First request (will hit the "server")
    console.log('First request:');
    const response1 = await fetcher.fetchData({
        url: '/api/users',
        method: 'GET'
    });
    // Second request (should come from cache)
    console.log('\nSecond request (cached):');
    const response2 = await fetcher.fetchData({
        url: '/api/users',
        method: 'GET'
    });
    console.log('Cache stats:', fetcher.getCacheStats());
}
async function exampleDeduplication() {
    console.log('\n=== Example 5: Request Deduplication ===');
    // Make multiple identical requests simultaneously
    const promises = [];
    for (let i = 0; i < 5; i++) {
        promises.push(fetcher.fetchData({
            url: '/api/users',
            method: 'GET'
        }));
    }
    console.log('Made 5 identical requests simultaneously');
    const responses = await Promise.all(promises);
    console.log('All requests completed. Only one actual network request was made.');
}
/**
 * Example 6: Request cancellation
 */
async function exampleCancellation() {
    console.log('\n=== Example 6: Request Cancellation ===');
    const controller = new AbortController();
    // Start a slow request
    const fetchPromise = fetcher.fetchData({
        url: '/api/slow-endpoint',
        method: 'GET',
        timeout: 10000 // Long timeout
    }, controller.signal);
    // Cancel after 1 second
    setTimeout(() => {
        console.log('Cancelling request...');
        controller.abort();
    }, 1000);
    try {
        await fetchPromise;
    }
    catch (error) {
        console.log('Request was cancelled');
    }
}
/**
 * Example 7: Type-safe data fetching with specific types
 */
async function exampleTypeSafety() {
    console.log('\n=== Example 7: Type-Safe Data Fetching ===');
    // Fetch users with proper typing
    const usersResponse = await fetcher.fetchData({
        url: '/api/users',
        method: 'GET'
    });
    if (usersResponse.success && usersResponse.data) {
        console.log('First user:', usersResponse.data[0].firstname);
    }
    // Fetch orders with proper typing
    const ordersResponse = await fetcher.fetchData({
        url: '/api/orders',
        method: 'GET'
    });
    if (ordersResponse.success && ordersResponse.data) {
        const totalPrice = ordersResponse.data.reduce((sum, order) => sum + order.price, 0);
        console.log('Total order price:', totalPrice);
    }
}
/**
 * Main demo function
 */
async function runDemo() {
    console.log('🚀 Starting Async Data Fetcher Demo\n');
    // Mock the fetch function globally
    global.fetch = async (input, options) => {
        let url;
        if (typeof input === 'string') {
            url = input;
        }
        else if (input instanceof URL) {
            url = input.toString();
        }
        else if (typeof input === 'object' && 'url' in input) {
            url = input.url;
        }
        else {
            throw new Error('Unsupported fetch input type');
        }
        // Simulate different endpoints
        if (url.includes('/api/users')) {
            const data = await server.handleRequest(url, mockData_1.users);
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (url.includes('/api/orders')) {
            if (options?.method === 'POST' && options.body) {
                const newOrder = JSON.parse(options.body);
                const data = await server.handleRequest(url, newOrder);
                return new Response(JSON.stringify(data), {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            const data = await server.handleRequest(url, mockData_1.orders);
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        if (url.includes('/api/failing-endpoint')) {
            // Simulate a failing endpoint
            await server.handleRequest(url, null, 100, true);
            return new Response(null, { status: 500 });
        }
        if (url.includes('/api/slow-endpoint')) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            return new Response(JSON.stringify({ message: 'Slow response' }), {
                status: 200
            });
        }
        // Default response
        return new Response(JSON.stringify({ message: 'Not found' }), {
            status: 404
        });
    };
    // Run examples
    await exampleBasicGet();
    await examplePost();
    await exampleErrorHandling();
    await exampleCaching();
    await exampleDeduplication();
    await exampleCancellation();
    await exampleTypeSafety();
    console.log('\n✨ Demo completed!');
}
// Run the demo
if (require.main === module) {
    runDemo().catch(console.error);
}
