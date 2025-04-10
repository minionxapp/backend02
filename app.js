// const express = require('express')
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
// Rputer
import authRouter from './router/authRouter.js'
import questionRouter from './router/questionRouter.js'
import devRouter from './router/devRouter.js'
import roleRouter from './router/roleRouter.js'
import kelasRouter from './router/kelasRouter.js';


import cookieParser from 'cookie-parser'
//unutk logger
import morgan from 'morgan'
import { errorHandler,notFound } from './middleware/errorHandler.js'

import myasetRouter from './router/myasetRouter.js';
import categoryRouter from './router/categoryRouter.js';
dotenv.config()
export const app = express()
const port = 3000

//middleware
// app.use(cors())
//setup untuk express
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
if(process.env.NODE_Env ==='development'){
  app.use(morgan('dev'))
}

  



// parent Router
app.use('/api/v1/dev',devRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/question',questionRouter)
app.use('/api/v1/role',roleRouter)
app.use('/api/v1/kelas',kelasRouter);

app.use('/api/v1/myaset',myasetRouter);

app.use('/api/v1/category',categoryRouter);

app.use(notFound)
app.use(errorHandler)


app.listen(port, () => {
  console.log(`aplikasi jalan pada port porti : ${port}`)
})

// connection db
mongoose.connect(process.env.DATABASE,{

}).then(()=>{
    // console.log("database connect")
})
export default app