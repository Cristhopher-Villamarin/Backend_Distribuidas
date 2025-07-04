const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      ca: process.env.DB_CA_CERT
    } : false
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida para el microservicio de categorias');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
})();

const rabbitMQConfig = {
  host: process.env.RABBITMQ_HOST,
  port: process.env.RABBITMQ_PORT,
  username: process.env.RABBITMQ_USER,
  password: process.env.RABBITMQ_PASSWORD
};

module.exports = {
  sequelize,
  rabbitMQConfig
};