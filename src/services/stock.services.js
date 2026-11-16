import { StockModel } from '../models/stock.model.js';
import { ProductosModel } from '../models/productos.model.js';

class StockService {
    /**
     * HU-06 / RF-05: Inicializar stock de un producto
     */
    async inicializarStock(productoId, totalStock = 0, stockMinimo = 5, session = null) {
        const opciones = session ? { session } : {};
        let stock = await StockModel.findOne({ producto: productoId }).session(session);

        if (stock) {
            stock.totalStock = Math.max(0, Number(totalStock));
            stock.stockMinimo = Math.max(0, Number(stockMinimo));
            return await stock.save(opciones);
        }

        const nuevoStock = new StockModel({
            producto: productoId,
            totalStock: Math.max(0, Number(totalStock)),
            stockMinimo: Math.max(0, Number(stockMinimo))
        });

        return await nuevoStock.save(opciones);
    }

    /**
     * HU-06: Descontar stock aceptando sesión transaccional (Usado por Ventas)
     * RNF-05: Prohibición de existencias negativas
     */
    async descontarStock(productoId, cantidad, session = null) {
        const opciones = session ? { session } : {};
        const stock = await StockModel.findOne({ producto: productoId }).session(session);

        if (!stock) {
            const err = new Error(`No se encontró registro de stock para el producto con ID '${productoId}'`);
            err.statusCode = 404;
            throw err;
        }

        const cantidadADescontar = Number(cantidad);
        if (cantidadADescontar <= 0) {
            const err = new Error('La cantidad a descontar debe ser mayor a 0');
            err.statusCode = 400;
            throw err;
        }

        if (stock.totalStock < cantidadADescontar) {
            const err = new Error(`Stock insuficiente. Stock actual: ${stock.totalStock}, Cantidad requerida: ${cantidadADescontar}`);
            err.statusCode = 400;
            throw err;
        }

        stock.totalStock -= cantidadADescontar;
        return await stock.save(opciones);
    }

    /**
     * HU-06: Incrementar stock aceptando sesión transaccional (Usado por Compras y Anulaciones)
     */
    async incrementarStock(productoId, cantidad, session = null) {
        const opciones = session ? { session } : {};
        let stock = await StockModel.findOne({ producto: productoId }).session(session);

        const cantidadASumar = Number(cantidad);
        if (cantidadASumar <= 0) {
            const err = new Error('La cantidad a incrementar debe ser mayor a 0');
            err.statusCode = 400;
            throw err;
        }

        if (!stock) {
            stock = new StockModel({
                producto: productoId,
                totalStock: cantidadASumar,
                stockMinimo: 5
            });
            return await stock.save(opciones);
        }

        stock.totalStock += cantidadASumar;
        return await stock.save(opciones);
    }

    /**
     * HU-06 / RF-06: Consulta de productos con stock crítico (totalStock <= stockMinimo)
     */
    async obtenerAlertasStockCritico() {
        // Busca todos los stocks donde totalStock <= stockMinimo
        const stocksCriticos = await StockModel.find({
            $expr: { $lte: ['$totalStock', '$stockMinimo'] }
        }).populate({
            path: 'producto',
            populate: { path: 'categoria' }
        });

        return stocksCriticos.map(stk => ({
            stockId: stk._id,
            productoId: stk.producto?._id,
            sku: stk.producto?.sku,
            nombreProductos: stk.producto?.nombreProductos,
            categoria: stk.producto?.categoria?.nombreCategoria,
            totalStock: stk.totalStock,
            stockMinimo: stk.stockMinimo,
            alerta: stk.totalStock === 0 ? 'AGOTADO' : 'STOCK CRÍTICO'
        }));
    }

    /**
     * Obtener stock de un producto específico
     */
    async obtenerStockPorProducto(productoId) {
        return await StockModel.findOne({ producto: productoId }).populate('producto');
    }
}

export const stockService = new StockService();
export default stockService;
