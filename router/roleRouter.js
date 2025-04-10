import express from 'express';
import { authMiddleware, permissionUser } from '../middleware/authMiddleware.js';
import { CreateRole, GetAllRole, GetRoleId, DeleteRole, UpdateRole, testRole } from '../controller/roleController.js';
const router = express.Router();

router.post('/', authMiddleware, permissionUser("admin"), CreateRole);
router.get('/', authMiddleware, permissionUser("admin"), GetAllRole);
router.get('/:id', authMiddleware, permissionUser("admin"), GetRoleId);
router.delete('/:id', authMiddleware, permissionUser("admin"), DeleteRole);
router.put('/:id', authMiddleware, permissionUser("admin"), UpdateRole);
router.get('/testrole1', testRole);

export default router;

//tambahkan pada app.js

//import roleRole from './router/RoleRouter.js';

//app.use('/api/v1/role',roleRouter); 
