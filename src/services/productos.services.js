import mongoose from 'mongoose';
import { ProductosModel } from '../models/productos.model.js';
import { StockModel } from '../models/stock.model.js';
import { CategoriaModel } from '../models/categorias.model.js';

class ProductosService {
    /**
     * HU-05: Crear producto y vincular 1:1 con StockModel
     */
    async crearProducto(datos) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const {
                sku,
                nombreProductos,
                nombre,
                descripcionProductos,
                descripcion,
                precioVenta,
                precio,
                ivaProductos = 0,
                categoria,
                totalStock = 0,
                stockMinimo = 5
            } = datos;

            const skuFinal = (sku || '').trim().toUpperCase();
            const nombreFinal = (nombreProductos || nombre || '').trim();
            const precioFinal = Number(precioVenta ?? precio ?? 0);
            const descFinal = descripcionProductos || descripcion || '';

            if (!skuFinal) {
                const err = new Error('El campo SKU es obligatorio y debe ser único');
                err.statusCode = 400;
                throw err;
            }

            if (!nombreFinal) {
                const err = new Error('El nombre del producto es obligatorio');
                err.statusCode = 400;
                throw err;
            }

            if (!categoria) {
                const err = new Error('La categoría del producto es obligatoria');
                err.statusCode = 400;
                throw err;
            }

            // Validar existencia de la categoría
            const catExiste = await CategoriaModel.findById(categoria).session(session);
            if (!catExiste) {
                const err = new Error(`La categoría con ID '${categoria}' no existe`);
                err.statusCode = 404;
                throw err;
            }

            // 1. Guardar ProductosModel
            const nuevoProducto = new ProductosModel({
                sku: skuFinal,
                nombreProductos: nombreFinal,
                descripcionProductos: descFinal,
                precioVenta: precioFinal,
                ivaProductos: Number(ivaProductos) || 0,
                categoria,
                estadoProductos: true
            });

            const productoGuardado = await nuevoProducto.save({ session });

            // 2. Vincular 1:1 e inicializar StockModel
            const nuevoStock = new StockModel({
                producto: productoGuardado._id,
                totalStock: Math.max(0, Number(totalStock) || 0),
                stockMinimo: Math.max(0, Number(stockMinimo) || 5)
            });

            const stockGuardado = await nuevoStock.save({ session });

            await session.commitTransaction();
            session.endSession();

            return {
                ...productoGuardado.toObject(),
                stock: stockGuardado
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    /**
     * HU-05: Buscar por SKU indexado (< 2s, RNF-01)
     */
    async obtenerProductoPorSku(sku) {
        const skuLimpio = (sku || '').trim().toUpperCase();
        const producto = await ProductosModel.findOne({ sku: skuLimpio, estadoProductos: true })
            .populate('categoria');

        if (!producto) return null;

        const stock = await StockModel.findOne({ producto: producto._id });

        return {
            ...producto.toObject(),
            totalStock: stock ? stock.totalStock : 0,
            stockMinimo: stock ? stock.stockMinimo : 5,
            stockCritico: stock ? (stock.totalStock <= stock.stockMinimo) : false
        };
    }

    /**
     * Listar todos los productos con su stock vinculado
     */
    async obtenerProductos() {
        const productos = await ProductosModel.find({ estadoProductos: true })
            .populate('categoria')
            .sort({ nombreProductos: 1 });

        const productosConStock = await Promise.all(
            productos.map(async (prod) => {
                const stock = await StockModel.findOne({ producto: prod._id });
                return {
                    ...prod.toObject(),
                    totalStock: stock ? stock.totalStock : 0,
                    stockMinimo: stock ? stock.stockMinimo : 5,
                    stockCritico: stock ? (stock.totalStock <= stock.stockMinimo) : false
                };
            })
        );

        return productosConStock;
    }

    /**
     * Obtener producto por ID
     */
    async obtenerProductoPorId(id) {
        const producto = await ProductosModel.findById(id).populate('categoria');
        if (!producto) return null;

        const stock = await StockModel.findOne({ producto: producto._id });
        return {
            ...producto.toObject(),
            totalStock: stock ? stock.totalStock : 0,
            stockMinimo: stock ? stock.stockMinimo : 5,
            stockCritico: stock ? (stock.totalStock <= stock.stockMinimo) : false
        };
    }
}

export const productosService = new ProductosService();
export default productosService;
