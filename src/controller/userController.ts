import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userServices';
import HttpStatusCodes from 'http-status-codes';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  console.log(req.body)
  try {
    const { username } = req.body;
    if (!username) {
       res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Username is required" });
    }

    const {user, followers , repositories} = await userService.fetchAndSaveUser(username);
    res.status(HttpStatusCodes.CREATED).send({
      user,
      repositories,
      followers,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    next(err);
  }
};

export const getUsersSorted = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sortBy = 'created_at', order = 'asc' } = req.query;

    
    const validSortFields = ['public_repos', 'public_gists', 'followers', 'following', 'created_at'];
    const validOrders = ['asc', 'desc'];

    if (!validSortFields.includes(sortBy as string)) {
       res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'Invalid sort field.' });
    }

    if (!validOrders.includes(order as string)) {
       res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'Invalid sort order. Use "asc" or "desc".' });
    }

    
    const users = await userService.getUsersSorted(sortBy as string, order as string);

    // Respond with the sorted users
    res.status(HttpStatusCodes.OK).send({ users });
  } catch (err) {
    console.error("Error fetching sorted users:", err);
    next(err);
  }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const user = await userService.softDeleteUser(id)

    res.status(HttpStatusCodes.OK).json({
      message: "User soft deleted successfully",
      user,
    })
  } catch (err) {
    console.error("Error deleting user:", err)
    next(err)
  }
}


// Find and save mutual followers
export const getMutualFriends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    const mutuals = await userService.findAndSaveMutualFriends(username);

    res.status(HttpStatusCodes.OK).json({
      message: "Mutual friends saved successfully",
      ...mutuals
    });
  } catch (error) {
    // console.error("Mutual friend error:", error);
    next(error);
  }
};

// Search users by partial username
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Username query required" });
    }

    const users = await userService.searchUsers(username as string);
    res.status(HttpStatusCodes.OK).json({ users });
  } catch (error) {
    console.error("Search user error:", error);
    next(error);
  }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await userService.updateUser(id, req.body);

    res.status(HttpStatusCodes.OK).json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    console.error("Update user error:", error);
    next(error);
  }
};
