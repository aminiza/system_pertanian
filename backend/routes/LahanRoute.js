import express from "express";
import {
  getLahanById,
  createLahan,
  updateLahan,
  deleteLahan,
  getLahan,
} from "../controllers/Lahan.js";
import { verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/lahan", verifyUser, getLahan);
router.get("/lahan/:id", verifyUser, getLahanById);
router.post("/lahan", verifyUser, createLahan);
router.patch("/lahan/:id", verifyUser, updateLahan);
router.delete("/lahan/:id", verifyUser, deleteLahan);

export default router;