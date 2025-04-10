import express from 'express';
import { authMiddleware, permissionUser } from '../middleware/authMiddleware.js';
import { CreateCategory, GetAllCategory, GetCategoryId, DeleteCategory, UpdateCategory, testCategory } from '../controller/categoryController.js';
const router = express.Router();

router.post('/', authMiddleware, permissionUser("admin"), CreateCategory);
router.get('/', authMiddleware, permissionUser("admin"), GetAllCategory);
router.get('/testcategory', testCategory);

router.get('/:id', authMiddleware, permissionUser("admin"), GetCategoryId);
router.delete('/:id', authMiddleware, permissionUser("admin"), DeleteCategory);
router.put('/:id', authMiddleware, permissionUser("admin"), UpdateCategory);
export default router;
