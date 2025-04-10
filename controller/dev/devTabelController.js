import DevTabel from "../../models/dev/DevTabel.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import DevTabelKolom from "../../models/dev/DevTabelKolom.js"


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

//get all tabel
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