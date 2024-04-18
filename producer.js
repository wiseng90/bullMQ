const { Queue } = require('bullmq')
const crypto = require('crypto');

// Add your own configuration here
const redisConfiguration = {
  connection: {
    host: "localhost",
    port: 6379,
    username: "default",
    password: "redispw"
  }
}

const myQueue = new Queue('emailSchedule', {
  redisConfiguration,
});

async function emailSchedule(email, message, delay) {
  await myQueue.add(crypto.randomUUID(), { email, message }, { 
    delay,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    // repeat: {
    //   every: 3000, // Repeat job every 3 seconds but no more than 100 times
    //   limit: 100,
    // },
    priority: 1,
    removeOnComplete: true,
    /*removeOnComplete: {
      age: 1000 * 60 * 60 * 24 * 30, // Remove job from completed list after 30 days
      count: 10 //Mantém 10 jobs
    }*/
    removeOnFail: 5000, // Remove job from failed list after 5 seconds
  });
}

emailSchedule("foo@bar.com", "Hello World!", 5000, 1); // The email will be available for consumption after 5 seconds. 