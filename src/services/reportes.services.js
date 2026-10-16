
export const obtenerResumenReportes = async () => {
    try {
        // Datos temporales mientras se crea el modulo de ventas
        const resumen = {
            totalVentas: 0,
            ingresos: 0,
            ganancias: 0
        };

        return resumen;
    } catch (error) {
        throw new Error('Error al obtener el resumen de reportes');
    }
};
