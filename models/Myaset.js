
import mongoose, { Schema } from "mongoose";
const myasetTabelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [false, "name connot be empty"],
        unique: [true, "name Sudah ada"]
    },
    description: {
        type: String,
        required: [false, "description connot be empty"],
        unique: [false, "description Sudah ada"]
    },
    category: {
        type: String,
        required: [false, "category connot be empty"],
        unique: [false, "category Sudah ada"]
    },
    tgl: {
        type: Date,
        required: [false, "tgl connot be empty"],
        unique: [false, "tgl Sudah ada"],
        default:null
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "UserId harus diisi"]
    }
},
    {
        timestamps: true
    })
const myasetTabel = mongoose.model("myaset", myasetTabelSchema)
export default myasetTabel