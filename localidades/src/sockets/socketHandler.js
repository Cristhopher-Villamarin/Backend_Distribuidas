module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    socket.on('notificacion', (data) => {
      io.emit('notificacion', data);
    });
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};