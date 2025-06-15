import express from "express";
import {
  getPengeluaranById,
  createPengeluaran,
  updatePengeluaran,
  deletePengeluaran,
  getPengeluaran,
  getJadwalDropdown
} from "../controllers/Pengeluaran.js";
import { verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/pengeluaran/jadwal/dropdown", verifyUser, getJadwalDropdown);

router.get("/pengeluaran", verifyUser, getPengeluaran);
router.get("/pengeluaran/:id", verifyUser, getPengeluaranById);
router.post("/pengeluaran", verifyUser, createPengeluaran);
router.patch("/pengeluaran/:id", verifyUser, updatePengeluaran);
router.delete("/pengeluaran/:id", verifyUser, deletePengeluaran);

export default router;