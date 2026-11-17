import {
    dbCreateReport,
    dbGetReports,
    dbGetReport,
    dbUpdateReport,
    dbDeleteReport
} from "../services/reportes.services.js";

const createReport = async (req, res) => {
    try {
        const data = await dbCreateReport(req.body);
        return res.status(201).json({ msg: "Reporte registrado", data });
    } catch (error) {
        console.error("Error al registrar reporte:", error);

        if (error.name === "ValidationError") {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ success: false, errors });
        }

        return res.status(500).json({ msg: "Error al registrar el reporte", error: error.message });
    }
};

const getReports = async (req, res) => {
    try {
        const data = await dbGetReports();
        return res.status(200).json({ msg: "Lista de reportes", data });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener reportes",
            error: error.message
        });
    }
};

const getReport = async (req, res) => {
    try {
        const data = await dbGetReport(req.params.id);

        if (!data) {
            return res.status(404).json({ msg: "Reporte no encontrado" });
        }

        return res.status(200).json({ msg: "Reporte encontrado", data });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el reporte",
            error: error.message
        });
    }
};

const updateReport = async (req, res) => {
    try {
        const data = await dbUpdateReport(req.params.id, req.body);

        if (!data) {
            return res.status(404).json({ msg: "Reporte no encontrado" });
        }

        return res.status(200).json({ msg: "Reporte actualizado", data });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar el reporte",
            error: error.message
        });
    }
};

const deleteReport = async (req, res) => {
    try {
        const data = await dbDeleteReport(req.params.id);

        if (!data) {
            return res.status(404).json({ msg: "Reporte no encontrado" });
        }

        return res.status(200).json({ msg: "Reporte eliminado", data });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al eliminar el reporte",
            error: error.message
        });
    }
};

export {
    createReport,
    getReports,
    getReport,
    updateReport,
    deleteReport
};