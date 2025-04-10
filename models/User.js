import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type :String,
        required :true,
        unique:[true,"user name sudah digunakan"]
    },
    email:{
        type:String,
        required :true,
        unique:[true,"email sudah digunakan"],
        validate :{
            validator:validator.isEmail,
            message:"input harus format email"
        }
    },
    password:{
        type:String,
        required:[true,"password harus diisi"],
        minLength :6

    },
    role:{
        type :String,
        enum:["user","admin","kasir"],
        default:"user"
    }
})

userSchema.methods.comparePassword = async function (reqPassword) {
    return await bcrypt.compare(reqPassword,this.password)
    
}

userSchema.pre("save",async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)

})
const User = mongoose.model("User",userSchema)

export default User