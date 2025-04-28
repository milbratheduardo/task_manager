import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware";
import { getUsers, getUserById, deleteUser } from "../controllers/userController";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;