// Simulate API call function
function simulateApiCall(id) {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 100;
    const shouldFail = Math.random() < 0.1; // 10% failure rate
    
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`Request ${id} failed`));
      } else {
        resolve({ id, data: `Result ${id}` });
      }
    }, delay);
  });
}

// 1. Sequential Approach
async function sequentialRequests(count) {
  const results = [];
  const errors = [];
  
  console.time('Sequential Time');
  
  for (let i = 0; i < count; i++) {
    try {
      const result = await simulateApiCall(i);
      results.push(result);
      console.log(`✓ Request ${i} completed`);
    } catch (error) {
      errors.push({ id: i, error: error.message });
      console.log(`✗ Request ${i} failed`);
    }
  }
  
  console.timeEnd('Sequential Time');
  
  return {
    successful: results,
    failed: errors,
    totalTime: null // We'll capture this via console.time
  };
}

// 2. Parallel Approach
async function parallelRequests(count) {
  const promises = [];
  const results = [];
  const errors = [];
  
  console.time('Parallel Time');
  
  // Create all promises
  for (let i = 0; i < count; i++) {
    promises.push(
      simulateApiCall(i)
        .then(result => {
          results.push(result);
          console.log(`✓ Request ${i} completed`);
        })
        .catch(error => {
          errors.push({ id: i, error: error.message });
          console.log(`✗ Request ${i} failed`);
        })
    );
  }
  
  // Wait for all promises to settle
  await Promise.all(promises);
  
  console.timeEnd('Parallel Time');
  
  return {
    successful: results,
    failed: errors,
    totalTime: null
  };
}

// 3. Parallel with Promise.allSettled (better error handling)
async function parallelRequestsAllSettled(count) {
  console.time('Parallel (allSettled) Time');
  
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(simulateApiCall(i));
  }
  
  const results = await Promise.allSettled(promises);
  
  const successful = [];
  const failed = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
      console.log(`✓ Request ${index} completed`);
    } else {
      failed.push({ id: index, error: result.reason.message });
      console.log(`✗ Request ${index} failed`);
    }
  });
  
  console.timeEnd('Parallel (allSettled) Time');
  
  return { successful, failed };
}

// 4. Bonus: Concurrency Limiting (Batching)
async function batchedRequests(count, batchSize = 10) {
  console.time(`Batched Time (${batchSize} concurrent)`);
  
  const successful = [];
  const failed = [];
  
  for (let i = 0; i < count; i += batchSize) {
    const batch = [];
    const batchEnd = Math.min(i + batchSize, count);
    
    console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1}: requests ${i} to ${batchEnd - 1}`);
    
    // Create promises for current batch
    for (let j = i; j < batchEnd; j++) {
      batch.push(
        simulateApiCall(j)
          .then(result => {
            successful.push(result);
            console.log(`✓ Request ${j} completed`);
          })
          .catch(error => {
            failed.push({ id: j, error: error.message });
            console.log(`✗ Request ${j} failed`);
          })
      );
    }
    
    // Wait for current batch to complete
    await Promise.all(batch);
  }
  
  console.timeEnd(`Batched Time (${batchSize} concurrent)`);
  
  return { successful, failed };
}

// Advanced: Concurrency limiting with queue pattern
async function queuedRequests(count, concurrency = 10) {
  console.time(`Queue Time (${concurrency} concurrent)`);
  
  const successful = [];
  const failed = [];
  
  // Create an array of request functions
  const requests = Array.from({ length: count }, (_, i) => async () => {
    try {
      const result = await simulateApiCall(i);
      successful.push(result);
      console.log(`✓ Request ${i} completed`);
    } catch (error) {
      failed.push({ id: i, error: error.message });
      console.log(`✗ Request ${i} failed`);
    }
  });
  
  // Process queue with limited concurrency
  async function processQueue() {
    const executing = [];
    
    for (const request of requests) {
      // Start the request and add its promise to executing array
      const promise = request().then(() => {
        // Remove from executing array when complete
        executing.splice(executing.indexOf(promise), 1);
      });
      
      executing.push(promise);
      
      // If we've reached concurrency limit, wait for one to finish
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
    
    // Wait for all remaining requests to complete
    await Promise.all(executing);
  }
  
  await processQueue();
  
  console.timeEnd(`Queue Time (${concurrency} concurrent)`);
  
  return { successful, failed };
}

// Test function to compare approaches
async function compareApproaches(count = 100) {
  console.log(`\n🚀 Testing with ${count} requests (10% expected failures)\n`);
  console.log('='.repeat(60));
  
  // Sequential
  console.log('\n📊 SEQUENTIAL APPROACH:');
  const sequentialStart = Date.now();
  const sequentialResult = await sequentialRequests(count);
  const sequentialTime = Date.now() - sequentialStart;
  
  // Parallel
  console.log('\n📊 PARALLEL APPROACH:');
  const parallelStart = Date.now();
  const parallelResult = await parallelRequests(count);
  const parallelTime = Date.now() - parallelStart;
  
  // Parallel with allSettled
  console.log('\n📊 PARALLEL (allSettled) APPROACH:');
  const parallelAllSettledStart = Date.now();
  const parallelAllSettledResult = await parallelRequestsAllSettled(count);
  const parallelAllSettledTime = Date.now() - parallelAllSettledStart;
  
  // Batched (bonus)
  console.log('\n📊 BATCHED APPROACH (10 concurrent):');
  const batchedStart = Date.now();
  const batchedResult = await batchedRequests(count, 10);
  const batchedTime = Date.now() - batchedStart;
  
  // Queue (advanced)
  console.log('\n📊 QUEUE APPROACH (10 concurrent):');
  const queueStart = Date.now();
  const queueResult = await queuedRequests(count, 10);
  const queueTime = Date.now() - queueStart;
  
  // Results summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 RESULTS SUMMARY:');
  console.log('='.repeat(60));
  
  console.log(`\nSequential: ${sequentialTime}ms`);
  console.log(`  ✓ Successful: ${sequentialResult.successful.length}`);
  console.log(`  ✗ Failed: ${sequentialResult.failed.length}`);
  
  console.log(`\nParallel: ${parallelTime}ms`);
  console.log(`  ✓ Successful: ${parallelResult.successful.length}`);
  console.log(`  ✗ Failed: ${parallelResult.failed.length}`);
  console.log(`  ⚡ Performance improvement: ${(sequentialTime/parallelTime).toFixed(1)}x faster!`);
  
  console.log(`\nParallel (allSettled): ${parallelAllSettledTime}ms`);
  console.log(`  ✓ Successful: ${parallelAllSettledResult.successful.length}`);
  console.log(`  ✗ Failed: ${parallelAllSettledResult.failed.length}`);
  
  console.log(`\nBatched (10 concurrent): ${batchedTime}ms`);
  console.log(`  ✓ Successful: ${batchedResult.successful.length}`);
  console.log(`  ✗ Failed: ${batchedResult.failed.length}`);
  
  console.log(`\nQueue (10 concurrent): ${queueTime}ms`);
  console.log(`  ✓ Successful: ${queueResult.successful.length}`);
  console.log(`  ✗ Failed: ${queueResult.failed.length}`);
}

// Run the comparison
compareApproaches(100).catch(console.error);