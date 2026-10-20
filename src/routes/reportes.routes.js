import { Router } from "express";

import {
  createReport,
  deleteReport,
  getReports,
  updateReport,
  getReport
} from "../controllers/reportes.controllers.js";

const router = Router();

router.post("/", createReport);
router.get("/", getReports);
router.get("/:id", getReport);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;