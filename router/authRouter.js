import express from 'express'
import {RegisterUser,LoginUser,LogoutUser,getUser} from '../controller/authController.js'
import  {authMiddleware, permissionUser} from '../middleware/authMiddleware.js'
// import { CreateModel } from '../controller/dev/createModel.js'
const router = express.Router()
//post /api/v1/auth/register
router.post('/register',RegisterUser)
//post /api/v1/auth/login
router.post('/login',LoginUser)
//get /api/v1/auth/logout
router.get('/logout',LogoutUser)
//get /api/v1/auth/getUser
router.get('/getUser',authMiddleware,getUser)

// get/api/v1/auth/test
router.get('/testrole',authMiddleware,permissionUser("admin"),(req,res)=>{
    res.send("berhasil")
    
})


// router.get('/test',CreateModel,(req,res)=>{
//     res.send("berhasil")
    
// })

export default router