const amqp = require('amqplib');
const Asiento = require('../models/asiento');

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'rabbitmq';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';

let connection = null;
let channel = null;

async function connectRabbitMQ() {
  try {
    if (!connection) {
      connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
      channel = await connection.createChannel();
      console.log('Conectado a RabbitMQ');
    }
    return channel;
  } catch (error) {
    console.error('Error al conectar con RabbitMQ:', error.message);
    throw error;
  }
}

async function setupAsientoReservaConsumer() {
  try {
    const channel = await connectRabbitMQ();
    const queue = 'asiento_reservas';
    const deadLetterExchange = 'asiento_reservas_dlx';
    const deadLetterQueue = 'asiento_reservas_expired';

    // Configurar intercambio de letras muertas
    await channel.assertExchange(deadLetterExchange, 'direct', { durable: true });
    await channel.assertQueue(deadLetterQueue, { durable: true });
    await channel.bindQueue(deadLetterQueue, deadLetterExchange, 'expired');

    // Configurar cola principal con TTL y letras muertas
    await channel.assertQueue(queue, {
      durable: true,
      messageTtl: 120000, // 2 minutos de TTL
      deadLetterExchange: deadLetterExchange,
      deadLetterRoutingKey: 'expired'
    });

    // Consumidor para manejar reservas expiradas
    await channel.consume(deadLetterQueue, async (msg) => {
      if (msg !== null) {
        try {
          const { idAsiento } = JSON.parse(msg.content.toString());
          console.log(`Procesando mensaje expir

ado para asiento ${idAsiento}`);
          const asiento = await Asiento.findByPk(String(idAsiento));
          if (asiento && asiento.estado === 'reservado') {
            console.log(`Asiento ${idAsiento} sigue reservado, actualizando a disponible`);
            await Asiento.update(
              { estado: 'disponible' },
              { where: { idAsiento: String(idAsiento), estado: 'reservado' } }
            );
            console.log(`Asiento ${idAsiento} actualizado a disponible`);
          } else {
            console.log(`Asiento ${idAsiento} ya no está reservado o no existe, ignorando`);
          }
          channel.ack(msg);
        } catch (error) {
          console.error(`Error al procesar reserva expirada para asiento ${idAsiento}:`, error.message);
          channel.nack(msg, false, false); // No reencolar
        }
      }
    }, { noAck: false });

    console.log('Consumidor de reservas de asientos iniciado en cola:', deadLetterQueue);
  } catch (error) {
    console.error('Error al configurar consumidor de RabbitMQ:', error.message);
    throw error;
  }
}

async function sendToQueue(queue, message) {
  try {
    const channel = await connectRabbitMQ();
    const deadLetterExchange = 'asiento_reservas_dlx';
    const deadLetterQueue = 'asiento_reservas_expired';

    await channel.assertExchange(deadLetterExchange, 'direct', { durable: true });
    await channel.assertQueue(deadLetterQueue, { durable: true });
    await channel.bindQueue(deadLetterQueue, deadLetterExchange, 'expired');

    await channel.assertQueue(queue, {
      durable: true,
      messageTtl: queue === 'asiento_reservas' ? 120000 : undefined,
      deadLetterExchange: queue === 'asiento_reservas' ? deadLetterExchange : undefined,
      deadLetterRoutingKey: queue === 'asiento_reservas' ? 'expired' : undefined
    });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Mensaje enviado a ${queue}:`, message);
  } catch (error) {
    console.error(`Error al enviar mensaje a ${queue}:`, error.message);
    throw error;
  }
}

module.exports = {
  connectRabbitMQ,
  setupAsientoReservaConsumer,
  sendToQueue
};