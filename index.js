const { Queue, Worker } = require('bullmq');
const crypto = require('crypto');

const redisConfiguration = {
    connection: {
      host: "localhost",
      port: 6379,
      username: "default",
      password: "redispw"
    }
  }

// Create a queue
const myQueue = new Queue('myQueue', {
  redisConfiguration,
});

// Add jobs to the queue
myQueue.add(crypto.randomUUID(), { data: 'Job 1 data'});
myQueue.add(crypto.randomUUID(), { data: 'Job 2 data'});
myQueue.add(crypto.randomUUID(), { data: 'Job 3 data'}, 
{
  batches: { size: 10 },
  delay: 5000 
}); // Delayed job

// Create a worker to process jobs
const worker = new Worker('myQueue', async (job) => {
  console.log(`Processing job ${job.id}: ${job.data}`);
  // Simulate some async processing
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(`Job ${job.id} completed`);
}, {
  redisConfiguration,
  batches: { size: 10 },
  concurrency: 5,
});


// Listen for completed jobs
worker.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed`);
});

