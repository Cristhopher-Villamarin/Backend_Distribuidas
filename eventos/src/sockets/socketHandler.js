module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado al microservicio de eventos:', socket.id);
    socket.on('notificacion', (data) => {
      io.emit('notificacion', { ...data, source: 'eventos' }); // Añade un identificador de fuente
    });
    socket.on('disconnect', () => {
      console.log('Usuario desconectado del microservicio de eventos:', socket.id);
    });
  });
};