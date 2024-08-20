import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUser } from '../controllers/userController.js';

const router = Router();


router.post('/api/user', createUser);
router.put('/api/user/:id', updateUser);
router.delete('/api/user/:id', deleteUser);
router.get('/api/user/:id', getUser);

export default router;
