require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { sequelize } = require('./src/config');
const compraRoutes = require('./src/routes/compraRoutes');
const errorHandler = require('./src/utils/errorHandler');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/compras', compraRoutes);

app.use(errorHandler);

sequelize.sync().then(() => {
  server.listen(process.env.PORT || 3004, () => {
    console.log('Microservicio de compras corriendo en el puerto', process.env.PORT || 3004);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});