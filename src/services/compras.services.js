import mongoose from 'mongoose';
import { ComprasModel } from '../models/compras.model.js';
import { DetalleCompraModel } from '../models/detalleCompra.model.js';
import ProductModel from '../models/product.model.js';
import { TerceroModel } from '../models/tercero.model.js';

class ComprasService {
    /**
     * RF-10 / HU-10:
     * Registro transaccional de compras a proveedores con incremento automático de existencias.
     */
    async crearCompra(dataCompra, usuarioAutenticado) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const {
                proveedor,
                subTotalCompras,
                ivaTotalCompras = 0,
                totalCompras,
                items = []
            } = dataCompra;

            if (!items || items.length === 0) {
                const err = new Error('La compra debe incluir al menos un producto para ingresar al inventario');
                err.statusCode = 400;
                throw err;
            }

            const usuarioId = usuarioAutenticado?._id || usuarioAutenticado?.id || dataCompra.usuario;
            if (!usuarioId) {
                const err = new Error('No se identificó al operador responsable del registro de la compra');
                err.statusCode = 401;
                throw err;
            }

            // Validar existencia del proveedor en TerceroModel
            const proveedorBD = await TerceroModel.findById(proveedor).session(session);
            if (!proveedorBD) {
                const err = new Error(`El proveedor con ID '${proveedor}' no existe en la base de datos`);
                err.statusCode = 404;
                throw err;
            }

            // Procesar cada ítem de compra y sumar existencias
            let subtotalCalculado = 0;
            const detallesParaGuardar = [];

            for (const item of items) {
                const productoId = item.producto || item.productoId;
                const cantidadComprada = Number(item.cantidadCompra || item.cantidad || 0);
                const valorUnitario = Number(item.valorUnitarioCompra || item.precio || 0);

                if (!productoId) {
                    const err = new Error('Cada ítem de la compra requiere un ID de producto válido');
                    err.statusCode = 400;
                    throw err;
                }

                if (cantidadComprada <= 0) {
                    const err = new Error('La cantidad de compra debe ser mayor a 0');
                    err.statusCode = 400;
                    throw err;
                }

                // Buscar producto en la base de datos
                const productoBD = await ProductModel.findById(productoId).session(session);
                if (!productoBD) {
                    const err = new Error(`El producto con ID '${productoId}' no existe en el catálogo`);
                    err.statusCode = 404;
                    throw err;
                }

                // HU-10 / RF-10: Sumar existencias automáticamente
                productoBD.stock = (Number(productoBD.stock) || 0) + cantidadComprada;
                await productoBD.save({ session });

                const subTotalItem = valorUnitario * cantidadComprada;
                const totalItem = Number(item.totalCompra) || subTotalItem;
                subtotalCalculado += subTotalItem;

                detallesParaGuardar.push({
                    producto: productoId,
                    cantidadCompra: cantidadComprada,
                    valorUnitarioCompra: valorUnitario,
                    subTotalCompra: subTotalItem,
                    totalCompra: totalItem
                });
            }

            const subTotalFinal = Number(subTotalCompras) || subtotalCalculado;
            const ivaFinal = Number(ivaTotalCompras) || 0;
            const totalFinal = Number(totalCompras) || (subTotalFinal + ivaFinal);

            // Crear cabecera de ComprasModel
            const nuevaCompra = new ComprasModel({
                proveedor,
                usuario: usuarioId,
                subTotalCompras: subTotalFinal,
                ivaTotalCompras: ivaFinal,
                totalCompras: totalFinal
            });

            const compraGuardada = await nuevaCompra.save({ session });

            // Vincular compra a cada detalle y guardar
            const detallesConCompraId = detallesParaGuardar.map(det => ({
                ...det,
                compra: compraGuardada._id
            }));

            const detallesGuardados = await DetalleCompraModel.insertMany(detallesConCompraId, { session });

            await session.commitTransaction();
            session.endSession();

            return {
                ...compraGuardada.toObject(),
                detalles: detallesGuardados
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async listarCompras() {
        return await ComprasModel.find()
            .populate('proveedor')
            .populate('usuario', 'nombreUsuario apellidoUsuario emailUsuario documentoUsuario rol')
            .sort({ createdAt: -1 });
    }

    async obtenerCompraPorId(id) {
        const compra = await ComprasModel.findById(id)
            .populate('proveedor')
            .populate('usuario', 'nombreUsuario apellidoUsuario emailUsuario documentoUsuario rol');

        if (!compra) return null;

        const detalles = await DetalleCompraModel.find({ compra: id }).populate('producto');
        return {
            ...compra.toObject(),
            detalles
        };
    }
}

export const comprasService = new ComprasService();
export default comprasService;
