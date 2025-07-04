const categoriaService = require('../services/categoriaService');
const notificationService = require('../services/notificationService');

// Crear categoría
exports.crearCategoria = async (req, res, next) => {
  try {
    const categoria = await categoriaService.crearCategoria(req.body);
    await notificationService.sendNotification('categorias', { tipo: 'creacion', categoria: categoria.idCategoria });
    res.status(201).json(categoria);
  } catch (err) { next(err); }
};

// Obtener todas las categorías
exports.obtenerTodos = async (req, res, next) => {
  try {
    const categorias = await categoriaService.obtenerTodos();
    res.json(categorias);
  } catch (err) { next(err); }
};

// Obtener categoría por ID
exports.obtenerPorId = async (req, res, next) => {
  try {
    const categoria = await categoriaService.obtenerPorId(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (err) { next(err); }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaService.buscarPorId(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    await categoriaService.actualizarCategoria(id, req.body);
    await notificationService.sendNotification('categorias', { tipo: 'actualizacion', categoria: id });
    res.json({ message: 'Categoría actualizada correctamente' });
  } catch (err) { next(err); }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaService.buscarPorId(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    await categoriaService.eliminarCategoria(id);
    await notificationService.sendNotification('categorias', { tipo: 'eliminacion', categoria: id });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) { next(err); }
};