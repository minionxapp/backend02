import asyncHandler from "../middleware/asyncHandler.js";
import { checkPermission } from "../middleware/checkPermission.js";
import mongoose, { isValidObjectId } from "mongoose";
import { validId, capitalize, lowerCase } from "../middleware/util.js"
import Myaset from "../models/Myaset.js";

export const testMyaset = asyncHandler(async (req, res) => {
    res.send('testt Myaset')

})

export const CreateMyaset = asyncHandler(async (req, res) => {
    const { name, description, category, tgl, } = req.body;

    const oldName = await Myaset.findOne({
        name: name
    });
    if (!oldName) {
        const newMyaset = await Myaset.create({
            name,
            description,
            category,
            tgl,
            userId: req.user._id
        })
        return res.status(200).json({
            message: "berhasil tambah data myaset",
        }
        )
    } else {
        return res.status(401).json({
            message: "Data sudah ada",
        })
    }
})


export const GetAllMyaset = asyncHandler(async (req, res) => {
    const MyasetData = await Myaset.find()
    return res.status(200).json({
        message: "Data Myaset berhasil di tampilkan semua",
        data: MyasetData
    })
})

export const GetMyasetId = asyncHandler(async (req, res) => {
    const idParam = req.params.id
    const detailMyaset = await Myaset.findById(idParam)
    // console.log("disini ..detailMyaset.."+detailMyaset)
    if (!detailMyaset) {
        return res.status(404).json({
            message: "Id Myaset tidak ditemukan"
        })
    }
    return res.status(200).json({
        message: "Document Id myaset berhasil di temukan",
        data: detailMyaset
    })
})

export const GetMyasetByName = asyncHandler(async (req, res) => {
//Untuk disesuaikan pencariannya
/*const myaset = req.params.myaset
const detailMyaset = await Myaset.find
({ nama: {$regex:myaset} })
if (!detailMyaset) {
return res.status(404).json({
message: "Myaset tidak ditemukan"
})
}
return res.status(200).json({
message: "Document Myaset berhasil di temukan", 
data: detailMyaset
})
*/})
export const DeleteMyaset = asyncHandler(async (req, res) => {
    //format id harus seuai dengan format ObjectId pad mongoo
    const idParam = req.params.id
    if (!validId(idParam)) {
        return res.status(404).json({
            message: "Format Id salah"
        })
    }
    const detailMyaset = await Myaset.findById(idParam)
    if (!detailMyaset) {
        return res.status(404).json({
            message: "Id pertanyaan tidak ditemukan"
        })
    }
    checkPermission(req.user, detailMyaset.userId, res)
    const deleteMyaset = await Myaset.findByIdAndDelete(idParam)
    return res.status(200).json({
        message: "Delete myaset berhasil"
    })
})

export const UpdateMyaset = asyncHandler(async (req, res) => {
    const { name, description, category, tgl, } = req.body;

    const paramId = req.params.id
    const idMyaset = await Myaset.findById(paramId)
    if (!idMyaset) {
        res.status(404)
        throw new Error("Pertanyaan tidak ditemukan")
    }
    checkPermission(req.user, idMyaset.userId, res)
    idMyaset.name = name
    idMyaset.description = description
    idMyaset.category = category
    idMyaset.tgl = tgl
    await idMyaset.save()
    return res.status(200).json({
        message: "Berhasil update myaset",
        data: idMyaset
    })
})

