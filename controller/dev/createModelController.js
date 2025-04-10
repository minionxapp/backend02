import { json } from "express"
import TabelKolom from "../../models/TabelKolom.js"
import mongoose from "mongoose"

export const CreateModel = (req, res) => {
    let tableName = 'tabelKolom'

    let kol = JSON.parse(
        '['
        + '{\"kolom\" : \"namaTabel\",\"tipe\":\"String\",\"required\":\"[true,\\"Nama Tabel tidak boleh kosong\\"]\",\"uniq\":"",\"defalt\":""}'
        + ',{\"kolom\" : \"namaKolom\",\"tipe\":\"String\",\"required\":\"[true,\\"Nama kolom tidak boleh kosong\\"]\",\"uniq\":"",\"defalt\":""}'
        + ',{\"kolom\" : \"tipeKolom\",\"tipe\":\"String\",\"required\":\"[true,\\"tipe kolom tidak boleh kosong\\"]\",\"uniq\":"",\"defalt\":"String"}'
        + ',{\"kolom\" : \"lebarKolom\",\"tipe\":\"Number\",\"required\":\"[true,\\"tipe kolom tidak boleh kosong\\"]\",\"uniq\":"",\"defalt\":"0"}'
        // + ',{\"kolom\" : \"lebarKolom\",\"tipe\":\"Number\",\"required\":\"[true,\\"tipe kolom tidak boleh kosong\\"]\",\"uniq\":"",\"defalt\":"0"}'
        + ']')
    let kolomScript = ''
    for (let index = 0; index < kol.length; index++) {
        const element = kol[index];
        kolomScript = kolomScript + koloms(kol[index].kolom, kol[index].tipe, kol[index].required, kol[index].uniq, kol[index].defalt)
    }
    res.send(
        "import mongoose from \"mongoose\";<br><br>" +'const  '+capitalize(tableName)
        +'Schema = new mongoose.Schema({<br>'+
        kolomScript + "})<br><br>"
        + 'const ' + capitalize(tableName) + ' = mongoose.model("' + tableName + '",' + capitalize(tableName) + 'Schema)<br>' +
        'export default ' + capitalize(tableName) + ''
    )
}

export const CreateTable = async(req, res) => {
    res.send("create tabel ya..dari backend.......");
    // const tabelKolom = await TabelKolom.create({
    //     namaTabel : 'tabelCoba',
    //     namaKolom : 'namaKolomCoba',
    //     tipeKolom:'String',
    //     lebarKolom :10



    // })

    // const newQuestion = await Question.create({
    //     title,
    //     question,
    //     category,
    //     userId: req.user._id
        
    // })
}

function koloms(colomName, tipe, requir, uniq, defalt) {
    if (tipe.length > 0) { tipe = ' type :' + tipe + ',' } else { tipe == "" }
    if (requir.length > 0) { requir = ' required :' + requir + ',' } else { requir == "" }
    if (uniq.length > 0) { uniq = ' unique:' + uniq + ',' } else { uniq == "" }
    if (defalt.length > 0) { defalt = ' default:' + defalt + ',' } else { defalt == "" }

    return '' + colomName + ':{' + tipe + requir + uniq + defalt + '},' + '<br>'
}

function capitalize(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
}