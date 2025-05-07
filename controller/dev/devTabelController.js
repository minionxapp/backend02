import DevTabel from "../../models/dev/DevTabel.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import DevTabelKolom from "../../models/dev/DevTabelKolom.js"
import { checkPermission } from "../../middleware/checkPermission.js";
import { validId, capitalize, lowerCase } from "../../middleware/util.js"

export const createDevTable = asyncHandler(async(req,res)=>{
    const { name, desc, priv } = req.body

    const oldTable = await DevTabel.findOne({       
        name: name
    }) 

    if(!oldTable){
        const newDevTabel = await DevTabel.create({
            name, 
            desc, 
            priv,
            owner: req.user.name,
            userId: req.user._id
        })
        return res.status(200).json({
            message: "berhasil tambah tabel",
            data: newDevTabel
        })
    }else{
        return res.status(401).json({ 
            message: "Tabel sudah ada",
            
        })
    }
})

export const getAllTabels = asyncHandler(async (req, res) => {
    const allDevTabels = await DevTabel.find()
    return res.status(200).json({
        message: "Data seluruh tabel berhasil di tampilkan ",
        data: allDevTabels
    })
})

export const getKolomByTabelId = asyncHandler(async (req, res) => {
    const data = await DevTabelKolom.find({tabel:req.params.id})
    return res.status(200).json({
        message: "Data seluruh tabel berhasil di tampilkan ",
        data: data
    })
})


export const deleteTabel = asyncHandler(async (req, res) => {
    const idParam = req.params.id
    if (!validId(idParam)) {
        return res.status(404).json({
                message: "Format Id salah"
            })  
            }
    const detailTabel = await DevTabel.findById(idParam)
    if (!detailTabel) {
        return res.status(404).json({
            message: "Id pertanyaan tidak ditemukan"
        })
    }
    checkPermission(req.user, detailTabel.userId, res)
    const deleteTabel= await DevTabel.findByIdAndDelete(idParam)
    return res.status(200).json({
        message: "Delete category berhasil"
    })
})