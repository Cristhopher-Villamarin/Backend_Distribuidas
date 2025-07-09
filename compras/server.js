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
        // Para arrays de números grandes (como asientos)
        if (Array.isArray(value)) {
          return value.map(item => {
            if (typeof item === 'number' && item > Number.MAX_SAFE_INTEGER) {
              return item.toString();
            }
            return item;
          });
        }
        return value;
      });
      console.log('JSON parseado correctamente:', req.body);
    } catch (error) {
      console.error('Error al parsear JSON:', error);
      return res.status(400).json({ error: 'JSON inválido' });
    }
  }
  next();
});

// Middleware adicional para convertir asientos a strings
app.use('/api/compras', (req, res, next) => {
  if (req.body && req.body.asientos) {
    req.body.asientos = req.body.asientos.map(id => {
      const stringId = String(id);
      console.log(`Asiento ID convertido: ${id} -> ${stringId}`);
      return stringId;
    });
  }
  next();
});

app.use('/api/compras', compraRoutes);

app.use(errorHandler);

sequelize.sync().then(() => {
  server.listen(process.env.PORT || 3004, () => {
    console.log('Microservicio de compras corriendo en el puerto', process.env.PORT || 3004);
  });
}).catch(err => {
  console.error('Error al conectar con la base de datos:', err);
});