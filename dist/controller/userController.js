"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.searchUsers = exports.getMutualFriends = exports.deleteUser = exports.getUsersSorted = exports.createUser = void 0;
const userService = __importStar(require("../services/userServices"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUser = async (req, res, next) => {
    console.log(req.body);
    try {
        const { username } = req.body;
        if (!username) {
            res.status(http_status_codes_1.default.BAD_REQUEST).send({ message: "Username is required" });
        }
        const { user, followersList, repos } = await userService.fetchAndSaveUser(username);
        res.status(http_status_codes_1.default.CREATED).send({
            user,
            repos,
            followersList,
        });
    }
    catch (err) {
        console.error("Error creating user:", err);
        next(err);
    }
};
exports.createUser = createUser;
const getUsersSorted = async (req, res, next) => {
    try {
        const { sortBy = 'created_at', order = 'asc' } = req.query;
        const validSortFields = ['public_repos', 'public_gists', 'followers', 'following', 'created_at'];
        const validOrders = ['asc', 'desc'];
        if (!validSortFields.includes(sortBy)) {
            res.status(http_status_codes_1.default.BAD_REQUEST).send({ message: 'Invalid sort field.' });
        }
        if (!validOrders.includes(order)) {
            res.status(http_status_codes_1.default.BAD_REQUEST).send({ message: 'Invalid sort order. Use "asc" or "desc".' });
        }
        const users = await userService.getUsersSorted(sortBy, order);
        // Respond with the sorted users
        res.status(http_status_codes_1.default.OK).send({ users });
    }
    catch (err) {
        console.error("Error fetching sorted users:", err);
        next(err);
    }
};
exports.getUsersSorted = getUsersSorted;
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.softDeleteUser(id);
        res.status(http_status_codes_1.default.OK).json({
            message: "User soft deleted successfully",
            user,
        });
    }
    catch (err) {
        console.error("Error deleting user:", err);
        next(err);
    }
};
exports.deleteUser = deleteUser;
// Find and save mutual followers
const getMutualFriends = async (req, res, next) => {
    try {
        const { username } = req.params;
        const mutuals = await userService.findAndSaveMutualFriends(username);
        res.status(http_status_codes_1.default.OK).json({
            message: "Mutual friends saved successfully",
            ...mutuals
        });
    }
    catch (error) {
        // console.error("Mutual friend error:", error);
        next(error);
    }
};
exports.getMutualFriends = getMutualFriends;
// Search users by partial username
const searchUsers = async (req, res, next) => {
    try {
        const queryKeys = Object.keys(req.query);
        if (queryKeys.length === 0) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: "At least one query param required" });
            return;
        }
        const [key] = queryKeys;
        const value = req.query[key];
        const searchableFields = ["login", "name", "username", "location", "blog", "bio"];
        if (!searchableFields.includes(key)) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: `Invalid query field: ${key}` });
        }
        const users = await userService.searchUsersByField(key, value);
        res.status(http_status_codes_1.default.OK).json({ users });
    }
    catch (error) {
        console.error("Search user error:", error);
        next(error);
    }
};
exports.searchUsers = searchUsers;
// Update user by ID
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await userService.updateUser(id, req.body);
        res.status(http_status_codes_1.default.OK).json({
            message: "User updated successfully",
            user: updated,
        });
    }
    catch (error) {
        console.error("Update user error:", error);
        next(error);
    }
};
exports.updateUser = updateUser;
