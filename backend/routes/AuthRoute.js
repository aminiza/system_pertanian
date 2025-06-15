import express from "express";
import {
  login, 
  logout,
  Me
} from "../controllers/Auth.js";
const router = express.Router();

router.post("/login", login);
router.get("/me", Me);
router.delete("/logout", logout);

export default router;