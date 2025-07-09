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

// Middleware personalizado para manejar BigInt en JSON
app.use(express.text({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    try {
      // Parsear JSON manualmente preservando números grandes como strings
      req.body = JSON.parse(req.body, (key, value) => {
        // Si el valor es un número muy grande, mantenerlo como string
        if (typeof value === 'number' && value > Number.MAX_SAFE_INTEGER) {
          return value.toString();
        }
        // Si es un string que representa un número grande, mantenerlo como string
        if (typeof value === 'string' && /^\d{16,}$/.test(value)) {
          return value;
        }
        return value;
      });
    } catch (error) {
      console.error('Error al parsear JSON:', error);
      return res.status(400).json({ error: 'JSON inválido' });
    }
  }
  next();
});

// Middleware adicional para convertir IDs en parámetros de ruta
app.use('/api/localidades', (req, res, next) => {
  // Convertir parámetros de ruta a strings para manejar BigInt
  if (req.params.id) {
    req.params.id = String(req.params.id);
    console.log(`Parámetro ID convertido: ${req.params.id}`);
  }
  next();
});

// Rutas
app.use('/api/localidades', localidadRoutes);

// Manejo de errores global
app.use(errorHandler);

// WebSockets
socketHandler(io);
  
// Sincronizar modelos y levantar servidor
sequelize.sync().then(() => {
  server.listen(process.env.PORT || 3003, () => {
    console.log('Microservicio de localidades corriendo en el puerto', process.env.PORT || 3003);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});