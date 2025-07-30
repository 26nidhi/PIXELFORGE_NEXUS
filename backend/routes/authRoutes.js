import express from "express";
import {
  registerUser,
  loginUser,
  getLeads,
  getDevelopers,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", protect, authorizeRoles("Admin"), registerUser);
router.get("/leads", protect, authorizeRoles("Admin"), getLeads);
router.get(
  "/developers",
  protect,
  authorizeRoles("Project Lead"),
  getDevelopers
);


export default router;
