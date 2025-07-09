const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379' // backup por si falta .env
});

redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Conectado a Redis');
  } catch (error) {
    console.error('❌ Error conectando a Redis:', error);
  }
})();

module.exports = redisClient;