import express from "express";
import {
  getPenggunaanPupukById,
  createPenggunaanPupuk,
  updatePenggunaanPupuk,
  deletePenggunaanPupuk,
  getPenggunaanPupuk,
  validasiPenggunaan,
  cekValidasiPenggunaan,
} from "../controllers/PenggunaanPupuk.js";
import { isApproveUser, verifyUser } from "../middleware/AuthUser.js";
const router = express.Router();

router.get("/penggunaan", verifyUser, isApproveUser, getPenggunaanPupuk);
router.get("/penggunaan/cek-validasi", verifyUser, cekValidasiPenggunaan);
router.get("/penggunaan/:id", verifyUser, getPenggunaanPupukById);
router.patch("/penggunaan/:id/validasi", verifyUser, validasiPenggunaan);
router.post("/penggunaan", verifyUser, createPenggunaanPupuk);
router.patch("/penggunaan/:id", verifyUser, updatePenggunaanPupuk);
router.delete("/penggunaan/:id", verifyUser, deletePenggunaanPupuk);

export default router;