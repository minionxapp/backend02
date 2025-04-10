import mongoose, { Schema } from "mongoose";

const TabelKolomSchema = new mongoose.Schema({
namaTabel:{ type :String, required :[true,"Nama Tabel tidak boleh kosong"],},
namaKolom:{ type :String, required :[true,"Nama kolom tidak boleh kosong"],},
tipeKolom:{ type :String, required :[true,"tipe kolom tidak boleh kosong"], default:String,},
lebarKolom:{ type :Number, required :[true,"tipe kolom tidak boleh kosong"], default:0,},
})

const TabelKolom = mongoose.model("tabelKolom",TabelKolomSchema)
export default TabelKolom