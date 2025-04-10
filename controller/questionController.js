import Question from "../models/Question.js"
import asyncHandler from "../middleware/asyncHandler.js"
import { checkPermission } from "../middleware/checkPermission.js"
import mongoose, { isValidObjectId } from "mongoose";
export const CreateQuestion = asyncHandler(async (req, res) => {
    const { title, question, category } = req.body
    //cek apakah judul sudah ada
    const oldQuestion = await Question.findOne({      
        title: title
    }) 
    if(!oldQuestion){  

        const newQuestion = await Question.create({
            title,
            question,
            category,
            userId: req.user._id
            
        })
        
        return res.status(200).json({
            message: "berhasil tambah pertanyaan",
            data: newQuestion
        })
    }else{
        return res.status(401).json({
            message: "Judul sudah ada",
            
        })
    }

})

export const QuestionsAll = asyncHandler(async (req, res) => {
    const QuestionData = await Question.find()
    return res.status(200).json({
        message: "Data pertanyaan berhasil di tampilkan semua",
        data: QuestionData
    })

})

export const DetailQuestion = asyncHandler(async (req, res) => {
    const idParam = req.params.id
    const detailQuestion = await Question.findById(idParam)
    // console.log("disini ..detailQuestion.."+detailQuestion)
    if (!detailQuestion) {
        return res.status(404).json({
            message: "Id pertanyaan tidak ditemukan"
        })
    }
    return res.status(200).json({
        message: "Document Id pertanyaan berhasil di temukan",
        data: detailQuestion
    })
})

export const UpdateQuestion = asyncHandler(async (req, res) => {
    const { title, question, category } = req.body
    const paramId = req.params.id
    const idQuestion = await Question.findById(paramId)
    if (!idQuestion) {
        res.status(404)
        throw new Error("Pertanyaan tidak ditemukan")
    }

    checkPermission(req.user, idQuestion.userId, res)

    idQuestion.title = title
    idQuestion.category = category
    idQuestion.question = question
    await idQuestion.save()


    return res.status(200).json({
        message: "Berhasil update pertanyaan",
        data: idQuestion
    })
})

export const DeleteQuestion = asyncHandler(async (req, res) => {
    //format id harus seuai dengan format ObjectId pad mongoo
    const idParam = req.params.id
    if(isValidObjectId(idParam)==false){
        return res.status(404).json({
            message: "Format Id salah"
        })
    }
    const detailQuestion = await Question.findById(idParam)

    if (!detailQuestion ===null) {
        return res.status(404).json({
            message: "Id pertanyaan tidak ditemukan"
        })
    }
    checkPermission(req.user, detailQuestion.userId, res)

    const deleteQuestion = await Question.findByIdAndDelete(idParam)
    console.log(deleteQuestion)
    return res.status(200).json({
        message: "Delete pertanyaan berhasil"
    })
})