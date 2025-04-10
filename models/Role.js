
import mongoose, { Schema } from "mongoose";
const roleTabelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [True, "name connot be empty"],
        unique: [True, "name Sudah ada"]
    },
    desc: {
        type: String,
        required: [True, "desc connot be empty"],
        unique: [False, "desc Sudah ada"]
    },
    level: {
        type: String,
        required: [False, "level connot be empty"],
        unique: [False, "level Sudah ada"]
    },
},
    {
        timestamps: true
    })
const roleTabel = mongoose.model("role", roleTabelSchema)
export default roleTabel