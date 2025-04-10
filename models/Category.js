
import mongoose, { Schema } from "mongoose";
const categoryTabelSchema = new mongoose.Schema({
    label: {
        type: String,
        required: [true, "label connot be empty"],
        unique: [true, "label Sudah ada"]
    },
    value: {
        type: String,
        required: [true, "value connot be empty"],
        unique: [true, "value Sudah ada"]
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
const categoryTabel = mongoose.model("category", categoryTabelSchema)
export default categoryTabel