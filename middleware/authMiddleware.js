import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authMiddleware =async(req,res,next) =>{
    let token;
    console.log("========authMiddleware mytoken==========")
    console.log(JSON.stringify(req.headers['mytoken']))
    token = req.cookies.jwt
    console.log("========Token==req.cookies.jwt========")
    console.log(token)
    let decode;

    if(!token){
        return next(
            res.status(401).json({
                message :"Anda tidak boleh mengakases halaman ini"
            })
        )
    }
    
    

    try {
        decode = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decode)
    } catch (error) {
        // console.log(error)
        return next(
            res.status(401).json({
                message :"Session invalid/Expired"
            })
        )
    }

    const currenUser = await User.findById(decode.id)
    if(!currenUser){
        return next(
            res.status(401).json({
                message :"User tidak ditemukan"
            })
        )
    }

    req.user= currenUser

    next()

}

export const permissionUser =(...roles)=>{
    return (req, res, next)=>{
        //["admin","user","kasir"]

        if(!roles.includes(req.user.role)){
            return next(res.status(403).json({
                message: "role anda tidak bisa mengakase halaman"
            }))
        }
        next()
    }
}