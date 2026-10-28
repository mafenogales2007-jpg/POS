import ReportModes from "../models/reportes.model.js";

// Crear reporte
const dbCreateReport = async (newReport) => {
    return await ReportModes.create(newReport);
};

// Obtener todos los reportes
const dbGetReports = async () => {
    return await ReportModes.find();
};

// Obtener un reporte por ID
const dbGetReport = async (id) => {
    return await ReportModes.findById(id);
};

// Actualizar reporte
const dbUpdateReport = async (id, updatedReport) => {
    return await ReportModes.findByIdAndUpdate(
        id,
        updatedReport,
        { new: true, runValidators: true }
    );
};

// Eliminar reporte
const dbDeleteReport = async (id) => {
    return await ReportModes.findByIdAndDelete(id);
};

export {
    dbCreateReport,
    dbGetReports,
    dbGetReport,
    dbUpdateReport,
    dbDeleteReport
};