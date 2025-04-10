import asynchHandler from "../../middleware/asyncHandler.js";
import DevTabelKolom from "../../models/dev/DevTabelKolom.js";


export const createDevTabelKolom= asynchHandler(async(req,res)=>{
    const { tabel, kol_name, kol_tipe,kol_unique,kol_default,kol_tabelId,kol_required } = req.body
    const newDevTabel = await DevTabelKolom.create({
        tabel,
        kol_name,
        kol_tipe,
        kol_unique,
        kol_default,
        kol_tabelId,
        kol_required
    })
    console.log(newDevTabel)
    return res.status(200).json({
        message: "berhasil tambah tabel",
        data: newDevTabel
    })



})

export const DeleteKolom = asynchHandler(async (req, res) => {
    //format id harus seuai dengan format ObjectId pad mongoo
    const idParam = req.params.id
    console.log("id param "+idParam)
    // if(isValidObjectId(idParam)==false){
    //     return res.status(404).json({
    //         message: "Format Id salah"
    //     })
    // }
    const detail = await DevTabelKolom.findById(idParam)
    // console.log("detail "+detail)
    const deleteData = await DevTabelKolom.findByIdAndDelete(idParam)
    if (!detail|| deleteData===null) {
        return res.status(404).json({
            message: "Id Kolom tidak ditemukan"
        })
    }
    // checkPermission(req.user, detailQuestion.userId, res)
    return res.status(200).json({
        message: "Delete Koloom berhasil"
    })
})