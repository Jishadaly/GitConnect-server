import { Request, Response } from 'express';
import * as userService from '../services/userServices';

export const createUser = async (req: Request, res: Response) => {
    console.log(req.body)
  const { username } = req.body;
  const user = await userService.fetchAndSaveUser(username);
  res.status(200).json(user);
};

export const findFriends = async (req: Request, res: Response) => {
  const { username } = req.params;
  const friends = await userService.findMutualFriends(username);
  res.json(friends);
};
