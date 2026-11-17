
import mongoose from 'mongoose';
import { ProductosModel } from '../models/productos.model.js';
import { StockModel } from '../models/stock.model.js';
import { CategoriaModel } from '../models/categorias.model.js';

class ProductosService {

    // Crear producto e inicializar su stock
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

            if (!skuFinal) {
                const error = new Error('El SKU es obligatorio');
                error.statusCode = 400;
                throw error;
            }

            if (!nombreFinal) {
                const error = new Error('El nombre del producto es obligatorio');
                error.statusCode = 400;
                throw error;
            }

            if (!Number.isFinite(precioFinal) || precioFinal < 0) {
                const error = new Error('El precio debe ser un número válido y no negativo');
                error.statusCode = 400;
                throw error;
            }

            if (!categoria) {
                const error = new Error('La categoría del producto es obligatoria');
                error.statusCode = 400;
                throw error;
            }

            const iva = Number(ivaProductos);
            const stockInicial = Number(totalStock);
            const minimo = Number(stockMinimo);

            if (!Number.isFinite(iva) || iva < 0 || iva > 100) {
                const error = new Error('El IVA debe estar entre 0 y 100');
                error.statusCode = 400;
                throw error;
            }

            if (!Number.isFinite(stockInicial) || stockInicial < 0 ||
                !Number.isFinite(minimo) || minimo < 0) {
                const error = new Error('Las cantidades de stock deben ser números no negativos');
                error.statusCode = 400;
                throw error;
            }

            const categoriaExiste = await CategoriaModel
                .findById(categoria)
                .session(session);

            if (!categoriaExiste) {
                const error = new Error('La categoría indicada no existe');
                error.statusCode = 404;
                throw error;
            }

            const productoExistente = await ProductosModel
                .findOne({ sku: skuFinal })
                .session(session);

            if (productoExistente) {
                const error = new Error('Ya existe un producto con ese SKU');
                error.statusCode = 409;
                throw error;
            }

            const nuevoProducto = new ProductosModel({
                sku: skuFinal,
                nombreProductos: nombreFinal,
                descripcionProductos: descripcionProductos || descripcion || '',
                precioVenta: precioFinal,
                ivaProductos: iva,
                categoria,
                estadoProductos: true
            });

            const productoGuardado = await nuevoProducto.save({ session });

            const nuevoStock = new StockModel({
                producto: productoGuardado._id,
                totalStock: stockInicial,
                stockMinimo: minimo
            });

            const stockGuardado = await nuevoStock.save({ session });

            await session.commitTransaction();

            return {
                ...productoGuardado.toObject(),
                totalStock: stockGuardado.totalStock,
                stockMinimo: stockGuardado.stockMinimo,
                stockCritico: stockGuardado.totalStock <= stockGuardado.stockMinimo
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // Buscar producto por SKU
    async obtenerProductoPorSku(sku) {
        const skuLimpio = (sku || '').trim().toUpperCase();

        const producto = await ProductosModel.findOne({
            sku: skuLimpio,
            estadoProductos: true
        }).populate('categoria');

        if (!producto) return null;

        const stock = await StockModel.findOne({
            producto: producto._id
        });

        return {
            ...producto.toObject(),
            totalStock: stock?.totalStock ?? 0,
            stockMinimo: stock?.stockMinimo ?? 5,
            stockCritico: stock
                ? stock.totalStock <= stock.stockMinimo
                : false
        };
    }

    // Obtener todos los productos activos
    async obtenerProductos() {
        const productos = await ProductosModel.find({
            estadoProductos: true
        })
            .populate('categoria')
            .sort({ nombreProductos: 1 });

        const productosConStock = await Promise.all(
            productos.map(async (producto) => {
                const stock = await StockModel.findOne({
                    producto: producto._id
                });

                return {
                    ...producto.toObject(),
                    totalStock: stock?.totalStock ?? 0,
                    stockMinimo: stock?.stockMinimo ?? 5,
                    stockCritico: stock
                        ? stock.totalStock <= stock.stockMinimo
                        : false
                };
            })
        );

        return productosConStock;
    }

    // Obtener producto por ID
    async obtenerProductoPorId(id) {
        const producto = await ProductosModel.findOne({
            _id: id,
            estadoProductos: true
        }).populate('categoria');

        if (!producto) return null;

        const stock = await StockModel.findOne({
            producto: producto._id
        });

        return {
            ...producto.toObject(),
            totalStock: stock?.totalStock ?? 0,
            stockMinimo: stock?.stockMinimo ?? 5,
            stockCritico: stock
                ? stock.totalStock <= stock.stockMinimo
                : false
        };
    }

    // Actualizar producto y, si se solicita, sus existencias
    async actualizarProducto(id, datos) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const producto = await ProductosModel.findOne({
                _id: id,
                estadoProductos: true
            }).session(session);

            if (!producto) {
                await session.abortTransaction();
                return null;
            }

            const nombre = datos.nombreProductos ?? datos.nombre;
            const descripcion = datos.descripcionProductos ?? datos.descripcion;
            const precio = datos.precioVenta ?? datos.precio;

            if (nombre !== undefined) {
                if (!String(nombre).trim()) {
                    const error = new Error('El nombre del producto es obligatorio');
                    error.statusCode = 400;
                    throw error;
                }
                producto.nombreProductos = String(nombre).trim();
            }

            if (descripcion !== undefined) {
                producto.descripcionProductos = descripcion;
            }

            if (precio !== undefined) {
                const precioNumero = Number(precio);

                if (!Number.isFinite(precioNumero) || precioNumero < 0) {
                    const error = new Error('El precio debe ser válido y no negativo');
                    error.statusCode = 400;
                    throw error;
                }

                producto.precioVenta = precioNumero;
            }

            if (datos.sku !== undefined) {
                const nuevoSku = String(datos.sku).trim().toUpperCase();

                if (!nuevoSku) {
                    const error = new Error('El SKU es obligatorio');
                    error.statusCode = 400;
                    throw error;
                }

                producto.sku = nuevoSku;
            }

            if (datos.ivaProductos !== undefined) {
                const iva = Number(datos.ivaProductos);

                if (!Number.isFinite(iva) || iva < 0 || iva > 100) {
                    const error = new Error('El IVA debe estar entre 0 y 100');
                    error.statusCode = 400;
                    throw error;
                }

                producto.ivaProductos = iva;
            }

            if (datos.categoria !== undefined) {
                const categoriaExiste = await CategoriaModel
                    .findById(datos.categoria)
                    .session(session);

                if (!categoriaExiste) {
                    const error = new Error('La categoría indicada no existe');
                    error.statusCode = 404;
                    throw error;
                }

                producto.categoria = datos.categoria;
            }

            await producto.save({ session });

            if (datos.totalStock !== undefined ||
                datos.stockMinimo !== undefined) {

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

                if (datos.totalStock !== undefined) {
                    const cantidad = Number(datos.totalStock);

                    if (!Number.isFinite(cantidad) || cantidad < 0) {
                        const error = new Error('El stock no puede ser negativo');
                        error.statusCode = 400;
                        throw error;
                    }

                    stock.totalStock = cantidad;
                }

                if (datos.stockMinimo !== undefined) {
                    const minimo = Number(datos.stockMinimo);

                    if (!Number.isFinite(minimo) || minimo < 0) {
                        const error = new Error('El stock mínimo no puede ser negativo');
                        error.statusCode = 400;
                        throw error;
                    }

                    stock.stockMinimo = minimo;
                }

                await stock.save({ session });
            }

            await session.commitTransaction();

            return await this.obtenerProductoPorId(id);

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    }

    // Eliminación lógica para conservar el historial de ventas
    async eliminarProducto(id) {
        return await ProductosModel.findOneAndUpdate(
            {
                _id: id,
                estadoProductos: true
            },
            {
                $set: { estadoProductos: false }
            },
            {
                new: true,
                runValidators: true
            }
        );
    }
}

export const productosService = new ProductosService();
export default productosService;
