// src/models/ventas.model.js
import mongoose from '../config/mongo.config.js'; 

export const VentasModel = {
  // Crear una nueva venta junto con sus detalles
  async registrarVenta(ventaData) {
    const { cliente_id, usuario_id, total, metodo_pago, detalles } = ventaData;

    // Se recomienda usar transacciones para asegurar que se guarde
    // la cabecera y el detalle correctamente
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar la cabecera de la venta
      const [ventaResult] = await connection.query(
        `INSERT INTO ventas (cliente_id, usuario_id, total, metodo_pago, fecha) 
         VALUES (?, ?, ?, ?, NOW())`,
        [cliente_id, usuario_id, total, metodo_pago]
      );

      const ventaId = ventaResult.insertId;

      // 2. Insertar el detalle de la venta (múltiples productos)
      const detalleValues = detalles.map(item => [
        ventaId,
        item.producto_id,
        item.cantidad,
        item.precio_unitario,
        item.subtotal
      ]);

      await connection.query(
        `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
         VALUES ?`,
        [detalleValues]
      );

      // 3. Confirmar la transacción
      await connection.commit();
      return { id: ventaId, message: 'Venta registrada con éxito' };

    } catch (error) {
      // Revertir cambios si hay un error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Obtener todas las ventas
  async obtenerTodas() {
    const [rows] = await db.query(
      `SELECT v.id, v.fecha, v.total, v.metodo_pago, c.nombre AS cliente 
       FROM ventas v 
       LEFT JOIN clientes c ON v.cliente_id = c.id 
       ORDER BY v.fecha DESC`
    );
    return rows;
  },

  // Obtener una venta por ID con sus productos
  async obtenerPorId(id) {
    const [venta] = await db.query('SELECT * FROM ventas WHERE id = ?', [id]);
    if (venta.length === 0) return null;

    const [detalles] = await db.query(
      `SELECT d.*, p.nombre 
       FROM detalle_ventas d 
       JOIN productos p ON d.producto_id = p.id 
       WHERE d.venta_id = ?`,
      [id]
    );

    return {
      ...venta[0],
      detalles
    };
  }
};