import { Op } from "sequelize";
import Lahan from "../models/LahanModel.js";
import Users from "../models/UserModel.js";

export const getLahan = async (req, res) => {
    try {
        let response;
        if(req.role === "Admin") {
            response = await Lahan.findAll({
                attributes: ["uuid", "name", "luas", "alamat"],
                include: [{
                    model: Users,
                    attributes: ["name", "email"]
                }]
            })
        } else {
            response = await Lahan.findAll({
                attributes: ["uuid", "name", "luas", "alamat"],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ["name", "email"]
                }]
            })
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLahanById = async (req, res) => {
    try {
        const lahan = await Lahan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!lahan) return res.status(404).json({ message: "Lahan not found" });

        let response;
        if(req.role === "Admin") {
            response = await Lahan.findOne({
                attributes: ["uuid", "name", "luas", "alamat"],
                where: {
                    id: lahan.id
                },
                include: [{
                    model: Users,
                    attributes: ["name", "email"]
                }]
            })
        } else {
            response = await Lahan.findOne({
                attributes: ["uuid", "name", "luas", "alamat"],
                where: {
                    [Op.and]: [{id: lahan.id}, {userId: req.userId}]
                },
                include: [{
                    model: Users,
                    attributes: ["name", "email"]
                }]
            })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createLahan = async (req, res) => {
    const {name, luas, alamat} = req.body;
    try {
        await Lahan.create({
            name: name,
            luas: luas,
            alamat: alamat,
            userId: req.userId
        });
        res.status(201).json({ message: "Lahan created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLahan = async (req, res) => {
    try {
        const lahan = await Lahan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!lahan) return res.status(404).json({ message: "Lahan not found" });
        const {name, luas, alamat} = req.body;
        if(req.role === "Admin") {
            await Lahan.update({name, luas, alamat},{
                where: {
                    id: lahan.id
                }
            });
        } else {
            if(req.userId !== lahan.userId) return res.status(403).json({ message: "Access denied" });
            await Lahan.update({name, luas, alamat}, {
                where : {
                    [Op.and]: [{id: lahan.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({ message: "Lahan updated" });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteLahan = async (req, res) => {
    try {
        const lahan = await Lahan.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if(!lahan) return res.status(404).json({ message: "Lahan not found" });
        if(req.role === "Admin") {
            await Lahan.destroy({
                where: {
                    id: lahan.id
                }
            });
        } else {
            if(req.userId !== lahan.userId) return res.status(403).json({ message: "Access denied" });
            await Lahan.destroy({
                where : {
                    [Op.and]: [{id: lahan.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({ message: "Lahan deleted" });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};