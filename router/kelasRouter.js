import express from 'express';
 import {authMiddleware,permissionUser} from '../middleware/authMiddleware.js';  
import  {CreateKelas,GetAllKelas,GetKelasId,DeleteKelas,UpdateKelas,testKelas} from '../controller/kelasController.js';
const router = express.Router();

router.post('/',authMiddleware,permissionUser("admin"),CreateKelas);
router.get('/',authMiddleware,permissionUser("admin"),GetAllKelas);
router.get('/testkelas',testKelas);

router.get('/:id',authMiddleware,permissionUser("admin"),GetKelasId);
router.delete('/:id',authMiddleware,permissionUser("admin"),DeleteKelas);
router.put('/:id',authMiddleware,permissionUser("admin"),UpdateKelas);
export default router;



//tambahkan pada app.js
 /*
import kelasRouter from './router/kelasRouter.js';
app.use('/api/v1/kelas',kelasRouter);
*/
//create file
/*
touch ./backend/models/Kelas.js
touch ./backend/router/kelasRouter.js
touch ./backend/controller/kelasController.js
*/
//Hapus  file
/*
rm ./backend/models/Kelas.js
rm ./backend/router/kelasRouter.js
rm ./backend/controller/kelasController.js
*/