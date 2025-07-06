require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { sequelize } = require('./src/config');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const errorHandler = require('./src/utils/errorHandler'); // Asegúrate de que este archivo exista o créalo
const socketHandler = require('./src/sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/categorias', categoriaRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta [${req.method}] ${req.originalUrl} no existe en este servidor.`,
    suggestion: 'Verifique la URL y el método HTTP utilizado.'
  });
});

// Manejo de errores global
app.use(errorHandler);

// WebSockets
socketHandler(io);

// Sincronizar modelos y levantar servidor
sequelize.sync().then(() => {
  server.listen(process.env.PORT || 3001, () => {
    console.log(`Microservicio de categorias corriendo en el puerto ${process.env.PORT || 3001} a las ${new Date().toLocaleString('es-ES', { timeZone: 'America/Lima' })}`);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});