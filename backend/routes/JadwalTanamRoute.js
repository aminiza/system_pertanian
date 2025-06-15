import express from "express";
import {
  getJadwalTanamById,
  createJadwalTanam,
  updateJadwalTanam,
  deleteJadwalTanam,
  getJadwalTanam,
  getDropdownLahan
} from "../controllers/JadwalTanam.js";
import { verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/jadwal/lahan/dropdown", verifyUser, getDropdownLahan);

router.get("/jadwal", verifyUser, getJadwalTanam);
router.get("/jadwal/:id", verifyUser, getJadwalTanamById);
router.post("/jadwal", verifyUser, createJadwalTanam);
router.patch("/jadwal/:id", verifyUser, updateJadwalTanam);
router.delete("/jadwal/:id", verifyUser, deleteJadwalTanam);


export default router;