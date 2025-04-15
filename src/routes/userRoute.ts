import express from 'express';
import { body, param } from 'express-validator';
import * as userController from '../controller/userController';

const router = express.Router();

router.post('/',userController.createUser);

router.get('/:username/friends',
  param('username').isString().notEmpty(),
  userController.findFriends
);

// Add routes for search, soft delete, update, sort

export default router;




