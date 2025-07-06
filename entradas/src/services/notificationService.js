const amqp = require('amqplib');
const { rabbitMQConfig } = require('../config');

let channel;

async function connect() {
  const conn = await amqp.connect(`amqp://${rabbitMQConfig.username}:${rabbitMQConfig.password}@${rabbitMQConfig.host}:${rabbitMQConfig.port}`);
  channel = await conn.createChannel();
}

exports.sendNotification = async (queue, message) => {
  if (!channel) await connect();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};