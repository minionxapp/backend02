import { json } from "express"
import TabelKolom from "../../models/TabelKolom.js"
import mongoose, { isValidObjectId } from "mongoose"
import DevTabel from "../../models/dev/DevTabel.js"
import DevTabelKolom from "../../models/dev/DevTabelKolom.js"
import {validId,capitalize,lowerCase} from "../../middleware/util.js" 


export const createModel = async (req, res) => {
    const idParam = req.params.id
    const Tabel = await DevTabel.findById(idParam)
    const tabelName = Tabel.name
    let script = '\nimport mongoose,{Schema} from "mongoose";\n'

    const Koloms = await DevTabelKolom.find({ tabel: tabelName })
    script = script + 'const ' + tabelName + 'TabelSchema = new mongoose.Schema({\n'

    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        // console.log(element.kol_name)
        script = script + element.kol_name + ':{\ntype :' + element.kol_tipe + ',\n' + 'required :[' + lowerCase(element.kol_required) + ',"' +
            element.kol_name + ' connot be empty"],\n' + 'unique:[' + lowerCase(element.kol_unique) + ',"' + element.kol_name + ' Sudah ada"]\n},\n'

    }
    script = script + ' userId :{\n'+
        'type :Schema.Types.ObjectId,\n'+
        'ref :\'User\',\n'+
        'required : [true,"UserId harus diisi"]\n'+
    '}},'+'\n{\n    timestamps :true\n})\nconst ' + tabelName + 'Tabel = mongoose.model("' + tabelName + '",' + tabelName + 'TabelSchema)\n' +
        'export default ' + tabelName + 'Tabel'
    res.send(script)
}


export const createController = async (req, res) => {
    const idParam = req.params.id

    const Tabel = await DevTabel.findById(idParam)
    const tabelName = Tabel.name
    const Koloms = await DevTabelKolom.find({ tabel: tabelName })

    let controllerScript = 'import asyncHandler from "../middleware/asyncHandler.js";\n' +
        'import { checkPermission } from "../middleware/checkPermission.js";\n' +
        'import mongoose, { isValidObjectId } from "mongoose";\n'+
        'import {validId,capitalize,lowerCase} from "../middleware/util.js" \n'+
        'import '+capitalize(tabelName)+' from "../models/'+capitalize(tabelName)+'.js";\n\n'

    controllerScript = controllerScript + 'export const test' + capitalize(tabelName) + ' = asyncHandler(async (req, res) => {\n'+
        "res.send('testt " + capitalize(tabelName) + "')\n\n})\n\n "

    controllerScript = controllerScript + 'export const Create' + capitalize(tabelName) + ' = asyncHandler(async (req, res) => {\nconst { '

    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        controllerScript = controllerScript + element.kol_name + ','
    }

    controllerScript = controllerScript + '} = req.body;\n\n'
// unutk tabel yang mengandung unique kolom, unutk yang tidak mengandung unique kolom pikirkan lagi
let cekUniq = false
for (let i = 0; i < Koloms.length; i++) {
    const element = Koloms[i];
    if (element.kol_unique == 'True') {
        cekUniq = true
        i = Koloms.length
        
    }
}
console.log(cekUniq)
if(cekUniq==true){

    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        if (element.kol_unique == 'True') {
            controllerScript = controllerScript + 'const  old' + capitalize(element.kol_name) + '= await ' + capitalize(tabelName) + '.findOne({\n' +
            element.kol_name + ':' + element.kol_name + '\n});\n'
        }
    }
    
    controllerScript = controllerScript + 'if('
    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        if (element.kol_unique == 'True' && i == 0) {
            controllerScript = controllerScript + '!old' + capitalize(element.kol_name)
        } else if (element.kol_unique == 'True' && i > 0) {
            controllerScript = controllerScript + 'if(' + '!old' + capitalize(element.kol_name) + ' || '
        }
    }
    
    controllerScript = controllerScript + '){\n' +
    ' const new' + capitalize(tabelName) + ' = await ' + capitalize(tabelName) + '.create({\n'
    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        controllerScript = controllerScript + element.kol_name + ',\n'
    }
    controllerScript = controllerScript + 'userId: req.user._id})\n' +
    'return res.status(200).json({\n' +
    'message: "berhasil tambah data '+tabelName+'",\n'
    'data: new' + capitalize(tabelName) + '\n' +
    '})\n'
    
    
    controllerScript = controllerScript + '}\n)\n}else\n{\n'
    
    controllerScript = controllerScript +
    'return res.status(401).json({ \nmessage: "Data sudah ada",\n})' +
    '}\n '
    
}else{
    controllerScript= controllerScript +'//TIDAK ADA UNIQ COLUMN...............\n'+
    ' const new' + capitalize(tabelName) + ' = await ' + capitalize(tabelName) + '.create({\n'
    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        controllerScript = controllerScript + element.kol_name + ',\n'
    }
    controllerScript = controllerScript + 'userId: req.user._id})\n' +
    'return res.status(200).json({\n' +
    'message: "berhasil tambah data '+tabelName+'",\n'+
    'data: new' + capitalize(tabelName) + '\n' +
    '})\n'
    
}
    controllerScript = controllerScript + '})\n'
    // console.log(controllerScript)



    // lajut ke Getall
    controllerScript = controllerScript + '\n\nexport const GetAll' + capitalize(tabelName) + ' = asyncHandler(async (req, res) => {\n'+
    ' const '+capitalize(tabelName)+'Data = await '+capitalize(tabelName)+'.find()\n'+
    'return res.status(200).json({\n'+
        'message: "Data '+capitalize(tabelName)+' berhasil di tampilkan semua",\n'+
        'data: '+capitalize(tabelName)+'Data'+
    '})\n'
    controllerScript = controllerScript + '})\n\n'


     // lajut ke GetId
     controllerScript = controllerScript + 'export const Get' + capitalize(tabelName) + 'Id = asyncHandler(async (req, res) => {\n'+
     'const idParam = req.params.id\n'+
    'const detail'+capitalize(tabelName)+' = await '+capitalize(tabelName)+'.findById(idParam)\n'+
    '// console.log("disini ..detail'+capitalize(tabelName)+'.."+detail'+capitalize(tabelName)+')\n'+
    'if (!detail'+capitalize(tabelName)+') {\n'+
        'return res.status(404).json({\n'+
            'message: "Id '+capitalize(tabelName)+' tidak ditemukan"\n'+
        '})\n'+
    '}\n'+
    'return res.status(200).json({\n'+
        'message: "Document Id '+tabelName+' berhasil di temukan",\n'+
        'data: detail'+capitalize(tabelName)+'\n'+
    '})\n'

     controllerScript = controllerScript + '})\n\n'


     //buatkan unutk mebcari berdasarkan name
     controllerScript = controllerScript +
     'export const Get'+capitalize(tabelName)+'ByName = asyncHandler(async (req, res) => {\n'+
     '//Untuk disesuaikan pencariannya\n'+
     '/*const '+tabelName+' = req.params.'+tabelName+'\n'+
     'const detail'+capitalize(tabelName)+' = await '+capitalize(tabelName)+'.find\n'+
    '({ nama: {$regex:'+tabelName+'} })\n'+
    'if (!detail'+capitalize(tabelName)+') {\n'+
        'return res.status(404).json({\n'+
            'message: "'+capitalize(tabelName)+' tidak ditemukan"\n'+
        '})\n'+
    '}\n'+
    'return res.status(200).json({\n'+
        'message: "Document '+capitalize(tabelName)+' berhasil di temukan", \n'+
        'data: detail'+capitalize(tabelName)+'\n'+
    '})\n*/'+
     '})\n'
/*
export const GetKelasByName = asyncHandler(async (req, res) => {
    console.log("GetKelasByName")
    const kelas = req.params.kelas
    const detailKelas = await Kelas.find
    ({ nama: {$regex:kelas} })
    if (!detailKelas) {
        return res.status(404).json({
            message: "Id Kelas tidak ditemukan"
        })
    }
    return res.status(200).json({
        message: "Document Id kelas berhasil di temukan", 
        data: detailKelas
    })
})


*/




    // lajut ke Delete
     controllerScript = controllerScript + 'export const Delete' + capitalize(tabelName) + ' = asyncHandler(async (req, res) => {\n'+
     '//format id harus seuai dengan format ObjectId pad mongoo\n'+
    'const idParam = req.params.id\n'+
    ' if(!validId(idParam)){\n'+
        'return res.status(404).json({\n'+
            'message: "Format Id salah"\n'+
        '})\n'+
    '}\n'+
    'const detail'+capitalize(tabelName)+' = await '+capitalize(tabelName)+'.findById(idParam)\n'+
    'if (!detail'+capitalize(tabelName)+') {\n'+
        'return res.status(404).json({\n'+
            'message: "Id pertanyaan tidak ditemukan"\n'+
        '})\n'+
    '}\n'+
    'checkPermission(req.user, detail'+capitalize(tabelName)+'.userId, res)\n'+
    'const delete'+capitalize(tabelName)+' = await '+capitalize(tabelName)+'.findByIdAndDelete(idParam)\n'+
    'return res.status(200).json({\n'+
        'message: "Delete '+tabelName+' berhasil"\n'+
    '})\n'

     controllerScript = controllerScript + '})\n\n'


     // =========lajut ke Update
     controllerScript = controllerScript + 'export const Update' + capitalize(tabelName) + ' = asyncHandler(async (req, res) => {\n'+
     'const {'

     for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        controllerScript = controllerScript + element.kol_name + ','
    }
    controllerScript = controllerScript + '} = req.body;\n\n'+
    'const paramId = req.params.id\n'+
    'const id'+capitalize(tabelName)+' = await '+capitalize(tabelName)+'.findById(paramId)\n'+
    'if (!id'+capitalize(tabelName)+') {\n'+
        'res.status(404)\n'+
        'throw new Error("Pertanyaan tidak ditemukan")\n'+
    '}\n'+

    'checkPermission(req.user, id'+capitalize(tabelName)+'.userId, res)\n'

    for (let i = 0; i < Koloms.length; i++) {
        const element = Koloms[i];
        controllerScript = controllerScript + 'id'+capitalize(tabelName)+'.'+element.kol_name+'='+element.kol_name+'\n'
    }
    controllerScript = controllerScript + 'await id'+capitalize(tabelName)+'.save()\n'+
    'return res.status(200).json({\n'+
        'message: "Berhasil update '+tabelName+'",\n'+
        'data: id'+capitalize(tabelName)+'\n'+
    '})\n'
     controllerScript = controllerScript + '})\n\n'

    res.send(controllerScript)

}


export const createRouter = async (req, res) => {
    const idParam = req.params.id
    if(!validId(idParam)){
        return res.status(404).json({
            message: "Format Id salah"
        })
    }


    const Tabel = await DevTabel.findById(idParam)
    if(Tabel===null){
        res.send('tidak ditemukan')
    }else{
        const tabelName = Tabel.name
        const Koloms = await DevTabelKolom.find({ tabel: tabelName })
        let scriptRouter =''
        scriptRouter = scriptRouter + "import express from 'express';\n "+
        "import {authMiddleware,permissionUser} from '../middleware/authMiddleware.js';  \n"+
        "import  {"+
        "Create"+capitalize(tabelName)+","+
        "GetAll"+capitalize(tabelName)+","+
        "Get"+capitalize(tabelName)+"Id,"+
        "Delete"+capitalize(tabelName)+
        ",Update"+capitalize(tabelName)+
        ",test"+capitalize(tabelName)+
        "} from '../controller/"+tabelName+"Controller.js';\n"+

        "const router = express.Router();\n\r"+
        "router.post('/"+"'"+',authMiddleware,permissionUser("admin"),'+"Create"+capitalize(tabelName)+");\n"+
        "router.get('/"+"'"+',authMiddleware,permissionUser("admin"),'+"GetAll"+capitalize(tabelName)+");\n"+
        "router.get('/test" + lowerCase(tabelName) + "',test"+capitalize(tabelName)+");\n\n"+
        "router.get('/"+":id'"+',authMiddleware,permissionUser("admin"),'+"Get"+capitalize(tabelName)+"Id);\n"+
        "router.delete('/"+":id'"+',authMiddleware,permissionUser("admin"),'+"Delete"+capitalize(tabelName)+");\n"+
        "router.put('/"+":id'"+',authMiddleware,permissionUser("admin"),'+"Update"+capitalize(tabelName)+");\n"+
        "export default router;\n\n\n\r"+
        "//tambahkan pada app.js\n /*\nimport "+(tabelName)+"Router from './router/"+(tabelName)+"Router.js';\n"+
        "app.use('/api/v1/"+tabelName+"',"+tabelName+"Router);\n*/"+

        "\n//create file\n/*\n"+
        "touch ./backend/models/"+capitalize(tabelName)+".js\n" +
        "touch ./backend/router/"+tabelName+"Router.js\n"+
        "touch ./backend/controller/"+tabelName+"Controller.js\n*/\n"+
        "//Hapus  file\n/*\n"+
        "rm ./backend/models/"+capitalize(tabelName)+".js\n" +
        "rm ./backend/router/"+tabelName+"Router.js\n"+
        "rm ./backend/controller/"+tabelName+"Controller.js\n*/"
        
        res.send(scriptRouter)
        // res.send("tabel tdak di temukan") 
    }
}



// const capitalize = s => s && String(s[0]).toUpperCase() + String(s).slice(1)
// const lowerCase = s => s && String(s[0]).toLowerCase() + String(s).slice(1)

