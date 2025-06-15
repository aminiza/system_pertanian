import PenggunaanPupuk from "../models/PenggunaanPupukModel.js";
import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Mohon login ke akun anda" });
  }

  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  })

  if(!user) return res.status(404).json({ message: "User not found" });
  
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role !== "Admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

export const isApproveUser = async (req, res, next) => {
  const penggunaan = await PenggunaanPupuk.findOne({
    where: {
      createdBy: req.session.userId,
      status: "approve"
    }
  });

  if(!penggunaan && req.role !== "Admin") {
    return res.status(404).json({message: "Anda belum divalidasi oleh admin untuk mengakses halaman ini"});
  }
  next();
};
