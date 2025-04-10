import asyncHandler from "../middleware/asyncHandler.js";
import { checkPermission } from "../middleware/checkPermission.js";
import mongoose, { isValidObjectId } from "mongoose";

export const testRole = asyncHandler(async (req, res) => {
    res.send('testt Role 1 1 1 1 1 1 11 ')

})

export const CreateRole = asyncHandler(async (req, res) => {
    const { name, desc, level, } = req.body;

    oldName = await Role.findOne({
        name: name
    });
    if (!oldName) {
        const newRole = await Role.create({
            name,
            desc,
            level,
        })
        return res.status(200).json({
            message: "berhasil tambah data role",
        }
        )
    } else {
        return res.status(401).json({
            message: "Data sudah ada",
        })
    }
})
export const GetAllRole = asyncHandler(async (req, res) => {
    return res.status(200).json({
        message: "berhasil tambah data GetAllRole",
    }
    )
    
})

export const GetRoleId = asyncHandler(async (req, res) => {
})

export const DeleteRole = asyncHandler(async (req, res) => {
})

export const UpdateRole = asyncHandler(async (req, res) => {
})

