import express from "express";
import {
  createProject,
  getAllProjects,
  markProjectCompleted,
  deleteProject,
  assignDevelopers,
  getUserProjects,
} from "../controllers/projectController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/", protect, authorizeRoles("Admin"), createProject);
router.get("/", protect, authorizeRoles("Admin"), getAllProjects);
router.put(
  "/:id/complete",
  protect,
  authorizeRoles("Admin"),
  markProjectCompleted
);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteProject);

// Project Lead route - assign developers
router.put(
  "/:projectId/assign",
  protect,
  authorizeRoles("Project Lead"),
  assignDevelopers
);

// Get user-specific projects (Lead/Developer)
router.get("/my-projects", protect, getUserProjects);

export default router;
