require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { sequelize } = require('./src/config');
const localidadRoutes = require('./src/routes/localidadRoutes');
const errorHandler = require('./src/utils/errorHandler');
const socketHandler = require('./src/sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/localidades', localidadRoutes);

// Manejo de errores global
app.use(errorHandler);

// WebSockets
socketHandler(io);
  
// Sincronizar modelos y levantar servidor
sequelize.sync().then(() => {
  server.listen(process.env.PORT || 3003, () => {
    console.log('Microservicio de eventos corriendo en el puerto', process.env.PORT || 3003);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});