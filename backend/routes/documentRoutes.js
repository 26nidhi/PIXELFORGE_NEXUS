import express from "express";
import {
  uploadDocument,
  getProjectDocuments,
} from "../controllers/documentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Upload document (Admin/Lead)
router.post(
  "/:projectId/upload",
  protect,
  upload.single("file"),
  uploadDocument
);

// View documents (Team members or Admin)
router.get("/:projectId", protect, getProjectDocuments);

export default router;
