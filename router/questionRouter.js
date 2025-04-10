import express from 'express'
// import {RegisterUser,LoginUser,LogoutUser,getUser} from '../controller/authController.js'
import  {authMiddleware, permissionUser} from '../middleware/authMiddleware.js'
import {CreateQuestion,QuestionsAll,DetailQuestion,UpdateQuestion,DeleteQuestion} from '../controller/questionController.js'

const router = express.Router()

//CRUD

// Create dokumen
//post /api/v1/question/
router.post('/',authMiddleware,permissionUser("admin"),CreateQuestion)
 
// Read dokumen
//get /api/v1/question
router.get('/',/*authMiddleware,permissionUser("admin"),*/QuestionsAll)
//get /api/v1/question/:id
router.get('/:id',authMiddleware,permissionUser("admin"),DetailQuestion)

// update dokumen
//put /api/v1/question/:id
router.put('/:id',authMiddleware,permissionUser("admin","user"),UpdateQuestion)

// Delete
//delete /api/v1/question/:id
router.delete('/:id',authMiddleware,permissionUser("admin","user"),DeleteQuestion)

// // get/api/v1/auth/test
// router.get('/testrole',authMiddleware,permissionUser("admin"),(req,res)=>{
//     res.send("berhasil")
    
// })

export default router