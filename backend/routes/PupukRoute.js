import express from "express";
import {
  getPupukById,
  createPupuk,
  updatePupuk,
  deletePupuk,
  getPupuk,
} from "../controllers/Pupuk.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/pupuk", verifyUser, getPupuk);
router.get("/pupuk/:id", verifyUser, adminOnly, getPupukById);
router.post("/pupuk", verifyUser, adminOnly, createPupuk);
router.patch("/pupuk/:id", verifyUser, adminOnly, updatePupuk);
router.delete("/pupuk/:id", verifyUser, adminOnly, deletePupuk);

export default router;