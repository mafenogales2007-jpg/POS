import { VentaModel } from '../models/ventas.model.js';

class VentasService {
    // 1. Registrar una nueva venta
    async crearVenta(dataVenta) {
        try {
            // Calcular subtotales por cada producto y el total general de la venta
            let subtotalGeneral = 0;

            const productosConSubtotal = dataVenta.productos.map(item => {
                const subtotalItem = item.cantidad * item.precioUnitario;
                subtotalGeneral += subtotalItem;
                return {
                    ...item,
                    subtotal: subtotalItem
                };
            });

            const impuestosCalculados = dataVenta.impuestos || 0;
            const totalFinal = subtotalGeneral + impuestosCalculados;

            // Construir el objeto final para guardar
            const nuevaVenta = new VentaModel({
                ...dataVenta,
                productos: productosConSubtotal,
                subtotal: subtotalGeneral,
                impuestos: impuestosCalculados,
                total: totalFinal
            });

            const ventaGuardada = await nuevaVenta.save();
            return { success: true, data: ventaGuardada };
        } catch (error) {
            throw new Error(`Error al registrar la venta: ${error.message}`);
        }
    }

    // 2. Obtener todas las ventas (para el historial)
    async obtenerVentas() {
        try {
            const ventas = await VentaModel.find().sort({ createdAt: -1 }); // Las más recientes primero
            return { success: true, data: ventas };
        } catch (error) {
            throw new Error(`Error al obtener las ventas: ${error.message}`);
        }
    }

    // 3. Obtener una venta por su ID
    async obtenerVentaPorId(id) {
        try {
            const venta = await VentaModel.findById(id);
            if (!venta) {
                return { success: false, message: 'Venta no encontrada' };
            }
            return { success: true, data: venta };
        } catch (error) {
            throw new Error(`Error al buscar la venta: ${error.message}`);
        }
    }
}

export const ventasService = new VentasService();