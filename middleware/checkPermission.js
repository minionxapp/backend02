import { response } from "express"

export const checkPermission = (requestUser,resourceUserId,res)=>{
    if(requestUser.role ==='admin'){
        return
    }

    if(requestUser._id.toString() === resourceUserId.toString()){
        return 
    }
    response.status(401)
    throw new Error("Anda tidak bisa melakukan update/delete yang bukan milik anda")
}