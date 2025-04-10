import express from 'express'
import  {authMiddleware} from '../middleware/authMiddleware.js'
import { CreateModel,CreateTable } from '../controller/dev/createModelController.js'
import { createDevTable,getAllTabels,getKolomByTabelId } from '../controller/dev/devTabelController.js'
import { createDevTabelKolom, DeleteKolom } from '../controller/dev/devTabelKolomController.js'
import {createModel,createController,createRouter} from '../controller/dev/devCreateCRUD.js'

//unutk tambahan create script
// import {testRole} from '../controller/roleController.js'




const router = express.Router()

router.get('/test',CreateModel)
router.get('/createmodel',CreateTable)
router.post('/tabel',authMiddleware,createDevTable)

router.post('/tabelkolom',createDevTabelKolom)
router.get('/alltables',getAllTabels)
router.get('/kolombytabel/:id',getKolomByTabelId)
router.delete('/kolombytabel/:id',DeleteKolom)

router.get('/createcrudmodel/:id',createModel)
router.get('/createcrudcontroller/:id',createController)
router.get('/createrouter/:id',createRouter)

//test script route
// router.get('/testrole',testRole)


export default router