"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.searchUsersByField = exports.findAndSaveMutualFriends = exports.softDeleteUser = exports.getUsersSorted = exports.findMutualFollowers = exports.fetchAndSaveUser = void 0;
const axios_1 = __importDefault(require("axios"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const friendModal_1 = __importDefault(require("../models/friendModal"));
const reqValidtionErr_1 = require("../utils/reqValidtionErr");
const GIT_API = process.env.GIT_BASEURI;
const GIT_TOKEN = process.env.GIT_TOKEN;
console.log(GIT_API, GIT_TOKEN);
const requestConfig = {
    headers: {
        Authorization: `Bearer ${GIT_TOKEN}`,
    },
};
const fetchAndSaveUser = async (username) => {
    // 1. Check if user already exists
    let existingUser = await userModel_1.default.findOne({ username: username, isDeleted: false });
    if (!existingUser) {
        const { data } = await axios_1.default.get(`${GIT_API}/${username}`, requestConfig);
        const gitUser = data;
        existingUser = new userModel_1.default({
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
        axios_1.default.get(`${GIT_API}/${username}/repos`, requestConfig),
        axios_1.default.get(`${GIT_API}/${username}/followers`, requestConfig),
    ]);
    return {
        user: existingUser,
        repos: repositories.data,
        followersList: followers.data
    };
};
exports.fetchAndSaveUser = fetchAndSaveUser;
const findMutualFollowers = async (username) => {
    const [repositories, followers, followings] = await Promise.all([
        axios_1.default.get(`${GIT_API}/${username}/repos`, requestConfig),
        axios_1.default.get(`${GIT_API}/${username}/followers`, requestConfig),
        axios_1.default.get(`${GIT_API}/${username}/followings`, requestConfig),
    ]);
    const user = await userModel_1.default.findOne({ login: username });
    const mutualUsers = followers.data.filter((follower) => followings.data.some((following) => following.login === follower.login));
    return {
        user,
        repos: repositories.data,
        followers: followers.data,
        followings: followings.data,
        mutuals: mutualUsers,
    };
};
exports.findMutualFollowers = findMutualFollowers;
const getUsersSorted = async (sortBy, order) => {
    const sortOrder = order === 'desc' ? -1 : 1; // Handle sorting order (asc or desc)
    try {
        const users = await userModel_1.default.find({ isDeleted: false })
            .sort({ [sortBy]: sortOrder })
            .exec();
        return users;
    }
    catch (err) {
        console.error("Error fetching sorted users:", err);
        throw new Error("Error fetching sorted users");
    }
};
exports.getUsersSorted = getUsersSorted;
const softDeleteUser = async (userId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }
    const user = await userModel_1.default.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
    if (!user)
        throw new reqValidtionErr_1.NotFoundError("User");
    return user;
};
exports.softDeleteUser = softDeleteUser;
const findAndSaveMutualFriends = async (username) => {
    const user = await userModel_1.default.findOne({ login: username });
    if (!user)
        throw new reqValidtionErr_1.NotFoundError("User");
    const [followers, followings] = await Promise.all([
        axios_1.default.get(`${GIT_API}/${username}/followers`, requestConfig),
        axios_1.default.get(`${GIT_API}/${username}/following`, requestConfig),
    ]).catch((err) => {
        throw new reqValidtionErr_1.NotFoundError("please add valid user name, this user friends");
    });
    const mutuals = followers.data
        .filter((follower) => followings.data.some((follow) => follow.login === follower.login))
        .map((user) => ({
        login: user.login,
        avatar: user.avatar_url,
        type: user.type,
    }));
    const updatedDoc = await friendModal_1.default.findOneAndUpdate({ user: user._id }, { friends: mutuals }, { upsert: true, new: true });
    return { userId: user._id, friendsDoc: updatedDoc };
};
exports.findAndSaveMutualFriends = findAndSaveMutualFriends;
const searchUsersByField = async (field, value) => {
    const regex = new RegExp(value, 'i'); // Case-insensitive search
    const users = await userModel_1.default.find({
        [field]: { $regex: regex },
        isDeleted: false,
    }).select('login name username location avatar blog bio');
    return users;
};
exports.searchUsersByField = searchUsersByField;
const updateUser = async (id, data) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        throw new Error("Invalid user ID");
    const updatedUser = await userModel_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedUser)
        throw new Error("User not found");
    return updatedUser;
};
exports.updateUser = updateUser;
