import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReports,
  updateReport,
  getReport
} from "../controllers/reportes.controllers.js";

// Crea una instancia de las rutas de Express
const router = Router();

// Define las rutas para las categorías
router.post("/", createReport);
router.get("/", getReports);
router.delete("/:id", deleteReport);
router.patch("/:id", updateReport);
router.get("/:id", getReport);

// Exportar las rutas definidas en este archivo
export default router;