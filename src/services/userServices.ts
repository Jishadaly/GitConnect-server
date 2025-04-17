import axios from 'axios';
import User from '../models/userModel';
import { IGitUserProfile } from '../types/user';
import mongoose from 'mongoose';
import FriendModel from '../models/friendModal';
import { NotFoundError } from '../utils/reqValidtionErr';

const GIT_API = process.env.GIT_BASEURI!;
const GIT_TOKEN = process.env.GIT_TOKEN!;

console.log(GIT_API, GIT_TOKEN)

const requestConfig = {
  headers: {
    Authorization: `Bearer ${GIT_TOKEN}`,
  },
};

export const fetchAndSaveUser = async (username: string) => {
  // 1. Check if user already exists
  let existingUser = await User.findOne({ username: username, isDeleted: false });

  if (!existingUser) {
    const { data } = await axios.get(`${GIT_API}/${username}`, requestConfig);
    const gitUser = data as IGitUserProfile;

    existingUser = new User({
      login: gitUser.login,
      username: username,
      name: gitUser.name,
      location: gitUser.location,
      avatar: gitUser.avatar_url,
      blog: gitUser.blog,
      bio: gitUser.bio,
      public_repos: gitUser.public_repos,
      public_gists: gitUser.public_gists,
      followers: gitUser.followers,
      following: gitUser.following,
      github_created_at: gitUser.created_at,
    });
    // 4. Save to DB and return
    await existingUser.save();
  }

  const [repositories, followers] = await Promise.all([
    axios.get(`${GIT_API}/${username}/repos`, requestConfig),
    axios.get(`${GIT_API}/${username}/followers`, requestConfig),
  ]);

  return {
    user: existingUser,
    repositories: repositories.data,
    followers: followers.data
  }
};

export const findMutualFollowers = async (username: string) => {
  const [repositories, followers, followings] = await Promise.all([
    axios.get(`${GIT_API}/${username}/repos`, requestConfig),
    axios.get(`${GIT_API}/${username}/followers`, requestConfig),
    axios.get(`${GIT_API}/${username}/followings`, requestConfig),

  ]);

  const user = await User.findOne({ login: username });
  const mutualUsers = followers.data.filter((follower: any) =>
    followings.data.some((following: any) => following.login === follower.login)
  );

  return {
    user,
    repos: repositories.data,
    followers: followers.data,
    followings: followings.data,
    mutuals: mutualUsers,
  };
};

export const getUsersSorted = async (sortBy: string, order: string): Promise<IGitUserProfile[]> => {
  const sortOrder = order === 'desc' ? -1 : 1;  // Handle sorting order (asc or desc)

  try {
    const users = await User.find({ isDeleted: false })
      .sort({ [sortBy]: sortOrder })
      .exec();
    return users;
  } catch (err) {
    console.error("Error fetching sorted users:", err);
    throw new Error("Error fetching sorted users");
  }
};

export const softDeleteUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID")
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  )

  if (!user) throw new NotFoundError("User");

  return user
}


export const findAndSaveMutualFriends = async (username: string) => {
  const user = await User.findOne({ login: username });
  if (!user) throw new NotFoundError("User");
  
  const [followers, followings] = await Promise.all([
    axios.get(`${GIT_API}/${username}/followers`, requestConfig),
    axios.get(`${GIT_API}/${username}/following`, requestConfig),
  ]).catch((err) => {
   throw new NotFoundError("please add valid user name, this user friends");
  });
  

  const mutuals = followers.data
  .filter((follower: any) =>
    followings.data.some((follow: any) => follow.login === follower.login)
  )
  .map((user: any) => ({
    login: user.login,
    avatar: user.avatar_url,
    type: user.type,
  }));

  const updatedDoc = await FriendModel.findOneAndUpdate(
    { user: user._id },
    { friends: mutuals },
    { upsert: true, new: true }
  );

  return { userId: user._id, friendsDoc: updatedDoc };
};


export const searchUsers = async (usernameQuery: string) => {
  const regex = new RegExp(usernameQuery, 'i'); // Case-insensitive partial match
  const users = await User.find({ username: { $regex: regex }, isDeleted: false });
  return users;
};

export const updateUser = async (id: string, data: Partial<IGitUserProfile>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid user ID");

  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};
