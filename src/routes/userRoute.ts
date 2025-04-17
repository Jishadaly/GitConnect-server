// src/routes/userRoute.ts
import express from 'express';
import { body } from 'express-validator'; // Validation rules
import { createUser,deleteUser,getUsersSorted } from '../controller/userController'; // Your controller
import { validateRequest } from '../middlewares/reqValidator';
import { userCreationRules } from '../utils/validagtions';

const router = express.Router();

// Route for creating a user
router.post(
    '/create',
    userCreationRules,    // Apply validation rules
    // validateRequest,       // Apply the validation middleware
    createUser            // Your controller logic for creating a user
);

router.get('/',getUsersSorted)
router.patch('/soft-delete/:id',deleteUser)


export default router;
