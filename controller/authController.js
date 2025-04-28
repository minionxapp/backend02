import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import asynchHandler from "../middleware/asyncHandler.js"


const signToken = id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '6d'
    })
}

const cretaeSendToken =async(user,statusCode,res) =>{
    const token = signToken(user.id)
    const userLogged = await User.findById(user.id)
    // userLogged.jwt = token
    // userLogged.save()
    const updated = await userLogged.updateOne({ $set: {jwt:token}})
    console.log("1 :: "+updated)
    console.log(await User.findById(user.id))
    console.log("2")
    console.log("cretaeSendToken   "+token)
    console.log("3")
    // console.log(userLogged)

    const cookieOption ={
        expire :new Date(1*24*60*60*1000 ),
        httpOnly : true,
        security : false
    }
    res.cookie('jwt',token,cookieOption)
    user.password=undefined
     res.status(statusCode).json({
        data :user,
        token : token,
        cookieOption : cookieOption
    })

}

export const RegisterUser =asynchHandler (async (req, res) => {
        const createUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            role : req.body.role,
            jwt:''
        })
        cretaeSendToken(createUser,201,res)
})

export const LoginUser = asynchHandler(async (req, res) => {
    //validasi email dan password kosong
    if(!req.body.email && !req.body.password){
        res.status(400)
        throw new Error("Input email dan password tidak boleh kosong")
    }

    //cek email terdaftar atau tidak
    const userData = await User.findOne({
        email : req.body.email
    })
    console.log("5")
    console.log(userData)
    console.log("6")
    console.log(await userData.comparePassword(req.body.password))
    console.log("7")
    if(userData && (await userData.comparePassword(req.body.password))){
        console.log("8. cek user login OK.... ")
        const createToken = await cretaeSendToken(userData,200,res)
        console.log("9")
        console.log(createToken)
        console.log("10")
        // return createToken
    }else{
        res.status(400)
        throw new Error("Invalid User")
    }

})

export const LogoutUser = (req, res) => {
    res.cookie('jwt','',{
        expire :new Date(0),
        httpOnly : true,
        security : false
    })
    res.status(200).json({
        message:'logout Berhasil'
    })
}

export const getUser = async (req, res) => {   
    const user = await User.findById(req.user.id).select({passwor : 0})
    if(user){
        return res.status(200).json({
            user : user
        })
    }

    return res.status(401).json({
        message : 'user tidak ditemukan'
    })
}