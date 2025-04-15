import axios from 'axios';
import User from '../models/userModel';

export const fetchAndSaveUser = async (username: string) => {
    
  const existingUser = await User.findOne({ username, isDeleted: false });
  if (existingUser) return existingUser;

  const { data } = await axios.get(`https://api.github.com/users/${username}`);
  const newUser = new User({
    username: data.login,
    name: data.name,
    location: data.location,
    blog: data.blog,
    bio: data.bio,
    public_repos: data.public_repos,
    public_gists: data.public_gists,
    followers: data.followers,
    following: data.following,
    github_created_at: data.created_at,
  });
  return await newUser.save();
};

export const findMutualFriends = async (username: string) => {
  const { data: followingList } = await axios.get(`https://api.github.com/users/${username}/following`);
  const { data: followersList } = await axios.get(`https://api.github.com/users/${username}/followers`);

  const mutuals = followingList.filter((f: any) =>
    followersList.find((x: any) => x.login === f.login)
  );

  const user = await User.findOne({ username });
  const mutualUsernames = mutuals.map((u: any) => u.login);
  const mutualUsers = await User.find({ username: { $in: mutualUsernames }, isDeleted: false });

  user!.friends = mutualUsers.map(u => u._id);
  await user!.save();
  return mutualUsers;
};
