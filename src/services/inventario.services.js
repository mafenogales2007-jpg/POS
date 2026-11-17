
import mongoose from 'mongoose';
import { ProductosModel } from '../models/productos.model.js';
import { StockModel } from '../models/stock.model.js';
import MovimientoInventario from '../models/movimientoInventario.model.js';

class InventarioService {

    // Consultar inventario completo
    async obtenerInventario() {
        try {
            const productos = await ProductosModel.find()
                .populate('categoria')
                .sort({ nombreProductos: 1 })
                .lean();

            const inventario = await Promise.all(
                productos.map(async (producto) => {
                    const stock = await StockModel.findOne({
                        producto: producto._id
                    }).lean();

                    return {
                        ...producto,
                        totalStock: stock?.totalStock ?? 0,
                        stockMinimo: stock?.stockMinimo ?? 5
                    };
                })
            );

            return { success: true, data: inventario };

        } catch (error) {
            throw new Error(`Error al obtener el inventario: ${error.message}`);
        }
    }

    // Ajustar existencias manualmente
    async ajustarStockManual(
        id,
        cantidadAjuste,
        tipo = 'entrada',
        motivo = 'Ajuste manual de inventario',
        usuarioId = null
    ) {
        const session = await mongoose.startSession();

        try {
            if (!mongoose.isValidObjectId(id)) {
                throw new Error('El ID del producto no es válido');
            }

            if (!Number.isFinite(cantidadAjuste) || cantidadAjuste <= 0) {
                throw new Error('La cantidad debe ser un número mayor que cero');
            }

            if (!['entrada', 'salida'].includes(tipo)) {
                throw new Error('El tipo de movimiento debe ser entrada o salida');
            }

            let resultado;

            await session.withTransaction(async () => {
                const producto = await ProductosModel.findById(id).session(session);

                if (!producto) {
                    throw new Error('Producto no encontrado en el inventario');
                }

                if (!producto.estadoProductos) {
                    throw new Error('No se puede ajustar el stock de un producto inactivo');
                }

                let stock = await StockModel.findOne({
                    producto: producto._id
                }).session(session);

                if (!stock) {
                    stock = new StockModel({
                        producto: producto._id,
                        totalStock: 0,
                        stockMinimo: 5
                    });
                }

                const stockAnterior = stock.totalStock;

                if (tipo === 'entrada') {
                    stock.totalStock += cantidadAjuste;
                } else {
                    if (stock.totalStock < cantidadAjuste) {
                        throw new Error(
                            `Stock insuficiente. Stock actual: ${stock.totalStock}`
                        );
                    }

                    stock.totalStock -= cantidadAjuste;
                }

                await stock.save({ session });

                const movimiento = await MovimientoInventario.create([{
                    productoId: producto._id,
                    tipo,
                    cantidad: cantidadAjuste,
                    stockAnterior,
                    stockNuevo: stock.totalStock,
                    motivo,
                    usuarioId
                }], { session });

                resultado = {
                    producto,
                    stock,
                    movimiento: movimiento[0]
                };
            });

            return {
                success: true,
                message: 'Stock actualizado y registrado en el historial',
                data: {
                    ...resultado.producto.toObject(),
                    totalStock: resultado.stock.totalStock,
                    stockMinimo: resultado.stock.stockMinimo
                }
            };

        } catch (error) {
            throw new Error(`Error al ajustar el stock: ${error.message}`);
        } finally {
            await session.endSession();
        }
    }

    // Consultar productos con stock bajo
    async obtenerStockBajo() {
        try {
            const stocks = await StockModel.find({
                $expr: { $lte: ['$totalStock', '$stockMinimo'] }
            })
                .populate({
                    path: 'producto',
                    select: 'sku nombreProductos descripcionProductos precioVenta categoria estadoProductos',
                    match: { estadoProductos: true }
                })
                .lean();

            const productosBajos = stocks
                .filter(stock => stock.producto)
                .map(stock => ({
                    ...stock.producto,
                    totalStock: stock.totalStock,
                    stockMinimo: stock.stockMinimo
                }));

            return { success: true, data: productosBajos };

        } catch (error) {
            throw new Error(`Error al consultar stock bajo: ${error.message}`);
        }
    }

    // Consultar historial de movimientos (Kardex)
    async obtenerMovimientos(productoId = null) {
        try {
            const filtro = productoId ? { productoId } : {};

            const movimientos = await MovimientoInventario.find(filtro)
                .populate('productoId', 'sku nombreProductos precioVenta')
                .sort({ createdAt: -1 });

            return { success: true, data: movimientos };

        } catch (error) {
            throw new Error(`Error al obtener el historial de movimientos: ${error.message}`);
        }
    }
}

export const inventarioService = new InventarioService();

export default inventarioService;
