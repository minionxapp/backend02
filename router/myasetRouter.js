import express from 'express';
import { authMiddleware, permissionUser } from '../middleware/authMiddleware.js';
import { CreateMyaset, GetAllMyaset, GetMyasetId, DeleteMyaset, UpdateMyaset, testMyaset } from '../controller/myasetController.js';
const router = express.Router();

router.post('/', authMiddleware, permissionUser("admin"), CreateMyaset);
router.get('/', authMiddleware, permissionUser("admin"), GetAllMyaset);
router.get('/testmyaset', testMyaset);

router.get('/:id', authMiddleware, permissionUser("admin"), GetMyasetId);
router.delete('/:id', authMiddleware, permissionUser("admin"), DeleteMyaset);
router.put('/:id', authMiddleware, permissionUser("admin"), UpdateMyaset);
export default router;



//tambahkan pada app.js
/*
import myasetRouter from './router/myasetRouter.js';
app.use('/api/v1/myaset',myasetRouter);
*/
//create file
/*
touch ./backend/models/Myaset.js
touch ./backend/router/myasetRouter.js
touch ./backend/controller/myasetController.js
*/
//Hapus  file
/*
rm ./backend/models/Myaset.js
rm ./backend/router/myasetRouter.js
rm ./backend/controller/myasetController.js
*/