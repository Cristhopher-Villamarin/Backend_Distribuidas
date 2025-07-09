require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { sequelize } = require('./src/config');
const entradaRoutes = require('./src/routes/entradaRoutes');
const errorHandler = require('./src/utils/errorHandler');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/entradas', entradaRoutes);

app.use(errorHandler);

sequelize.sync().then(() => {
  server.listen(process.env.PORT || 3005, () => {
    console.log('Microservicio de entradas corriendo en el puerto', process.env.PORT || 3005);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});