import express from 'express';
import { createUser, deleteUser, getUsersSorted, getMutualFriends, searchUsers, updateUser } from '../controller/userController';
import { userCreationRules, userDeleteRules, userGetSortedRules, userSearchRules, userUpdateRules } from '../utils/validagtions';
import { validateRequest } from '../middlewares/reqValidator';

const router = express.Router();

// Create user
router.post('/create',userCreationRules,validateRequest,createUser);
router.get('/',userGetSortedRules,validateRequest, getUsersSorted);
router.patch('/soft-delete/:id', userDeleteRules,validateRequest,deleteUser);
router.get('/:username/friends', validateRequest,getMutualFriends);
router.get('/search',userSearchRules, validateRequest,searchUsers);
router.patch('/:id', userUpdateRules,validateRequest,updateUser);

export default router;
