import mongoose,{Schema} from "mongoose";


const DevTabelKolomSchema = new mongoose.Schema({
    tabel:{
        type :String,
        unique:[false]
    },   
    kol_name : {
        type :String,
        required :[true,"Name connot be empty"],
        unique:[false]
    },
    kol_tipe : {
        type :String,
        required :[true,"tpe connot be empty"],
        unique:[false]
    },
    kol_unique : {
        type :String,
        required :[true,"Uniq connot be empty"],
        unique:[false]
    },
    kol_required : {
        type :String,
        // required :[true,"Name connot be empty"],
        default:"required"
    },
    kol_default : {
        type :String,
        required :[true,"Default connot be empty"],
        unique:[false]
    },
    kol_tabelId :{
        // type :Schema.Types.ObjectId,
        // ref :'DevTabel',
        type :String,
        required : [true,"Tabel ID harus diisi"]
    },

},
{
    timestamps :true
}
)

const DevTabelKolom = mongoose.model("dev_table_kolom",DevTabelKolomSchema)

export default DevTabelKolom