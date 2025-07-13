 // routes/userRoutes.js

import express from 'express';
import { getAllUsers, updateUser,deleteUser} from '../controllers/userController.js';
import { registerUserController,loginUserController2} from '../controllers/authController.js';

const router = express.Router();

//Rutas de autenticación
router.post('/register', registerUserController);
router.post('/login', loginUserController2);

//Rutas de gestión de usuarios
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
