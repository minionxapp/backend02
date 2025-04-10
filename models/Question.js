import mongoose, { Schema } from "mongoose";
// import validator from "validator";
// import bcrypt from "bcryptjs"

const questionSchema = new mongoose.Schema({
    title:{
        type :String,
        required :[true,"Judul harus diinput"],
        unique:[true,"Judul sudah digunakan"]
    },
    question :{
        type:String,
        required :[true,"pertanyaan harus diisi"],
    },
    category:{
        type:String,
        enum:["javascript","database","Nodejs","vuejs"],
        required :[true,"pertanyaan harus memiliki category"]

    },
    userId :{
        type :Schema.Types.ObjectId,
        ref :'User',
        required : [true,"UserId harus diisi"]
    },
    countVote :{
        type : Number,
        default : 0
    }
},{
    timestamps :true
})

// userSchema.methods.comparePassword = async function (reqPassword) {
//     return await bcrypt.compare(reqPassword,this.password)
    
// }

// userSchema.pre("save",async function () {
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password,salt)

// })
const Question = mongoose.model("question",questionSchema)

export default Question