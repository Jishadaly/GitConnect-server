import express from 'express';
import { createUser, deleteUser, getUsersSorted, getMutualFriends, searchUsers, updateUser } from '../controller/userController';
import { userCreationRules } from '../utils/validagtions';
import { validateRequest } from '../middlewares/reqValidator';

const router = express.Router();

// Create user
router.post('/create',userCreationRules,createUser);
router.get('/', getUsersSorted);
router.patch('/soft-delete/:id', deleteUser);
router.get('/:username/friends', getMutualFriends);
// router.get('/search/query', searchUsers);
router.patch('/:id', updateUser);

export default router;
