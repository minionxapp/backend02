import asyncHandler from "../middleware/asyncHandler.js";
import { checkPermission } from "../middleware/checkPermission.js";
import mongoose, { isValidObjectId } from "mongoose";
import { validId, capitalize, lowerCase } from "../middleware/util.js"
import Category from "../models/Category.js";

export const testCategory = asyncHandler(async (req, res) => {
    res.send('testt Category')

})

export const CreateCategory = asyncHandler(async (req, res) => {
    const { label, value, } = req.body;

    const oldLabel = await Category.findOne({
        label: label
    });
    const oldValue = await Category.findOne({
        value: value
    });
    if (!oldLabel || !oldValue ){
        const newCategory = await Category.create({
            label,
            value,
            userId: req.user._id
        })
        return res.status(200).json({
            message: "berhasil tambah data category",
        }
        )
    } else {
        return res.status(401).json({
            message: "Data sudah ada",
        })
    }
})


export const GetAllCategory = asyncHandler(async (req, res) => {
    const CategoryData = await Category.find()
    return res.status(200).json({
        message: "Data Category berhasil di tampilkan semua",
        data: CategoryData
    })
})

export const GetCategoryId = asyncHandler(async (req, res) => {
    const idParam = req.params.id
    const detailCategory = await Category.findById(idParam)
    // console.log("disini ..detailCategory.."+detailCategory)
    if (!detailCategory) {
        return res.status(404).json({
            message: "Id Category tidak ditemukan"
        })
    }
    return res.status(200).json({
        message: "Document Id category berhasil di temukan",
        data: detailCategory
    })
})

export const GetCategoryByName = asyncHandler(async (req, res) => {
//Untuk disesuaikan pencariannya
/*const category = req.params.category
const detailCategory = await Category.find
({ nama: {$regex:category} })
if (!detailCategory) {
return res.status(404).json({
message: "Category tidak ditemukan"
})
}
return res.status(200).json({
message: "Document Category berhasil di temukan", 
data: detailCategory
})
*/})
export const DeleteCategory = asyncHandler(async (req, res) => {
    //format id harus seuai dengan format ObjectId pad mongoo
    const idParam = req.params.id
    if (!validId(idParam)) {
        return res.status(404).json({
            message: "Format Id salah"
        })
    }
    const detailCategory = await Category.findById(idParam)
    if (!detailCategory) {
        return res.status(404).json({
            message: "Id pertanyaan tidak ditemukan"
        })
    }
    checkPermission(req.user, detailCategory.userId, res)
    const deleteCategory = await Category.findByIdAndDelete(idParam)
    return res.status(200).json({
        message: "Delete category berhasil"
    })
})

export const UpdateCategory = asyncHandler(async (req, res) => {
    const { label, value, } = req.body;

    const paramId = req.params.id
    const idCategory = await Category.findById(paramId)
    if (!idCategory) {
        res.status(404)
        throw new Error("Pertanyaan tidak ditemukan")
    }
    checkPermission(req.user, idCategory.userId, res)
    idCategory.label = label
    idCategory.value = value
    await idCategory.save()
    return res.status(200).json({
        message: "Berhasil update category",
        data: idCategory
    })
})

