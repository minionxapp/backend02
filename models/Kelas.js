
import mongoose, { Schema } from "mongoose";
const kelasTabelSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [false, "nama connot be empty"],
        unique: [false, "nama Sudah ada"]
    },
    keterangan: {
        type: String,
        required: [false, "keterangan connot be empty"],
        unique: [false, "keterangan Sudah ada"]
    },
    level: {
        type: Number,
        required: [false, "level connot be empty"],
        unique: [false, "level Sudah ada"]
    },
    tgllahir: {
        type: Date,
        required: [false, "tgllahir connot be empty"],
        unique: [false, "tgllahir Sudah ada"]
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
const kelasTabel = mongoose.model("kelas", kelasTabelSchema)
export default kelasTabel