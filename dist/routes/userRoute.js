"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const validagtions_1 = require("../utils/validagtions");
const reqValidator_1 = require("../middlewares/reqValidator");
const router = express_1.default.Router();
// Create user
router.post('/create', validagtions_1.userCreationRules, reqValidator_1.validateRequest, userController_1.createUser);
router.get('/', validagtions_1.userGetSortedRules, reqValidator_1.validateRequest, userController_1.getUsersSorted);
router.patch('/soft-delete/:id', validagtions_1.userDeleteRules, reqValidator_1.validateRequest, userController_1.deleteUser);
router.get('/:username/friends', reqValidator_1.validateRequest, userController_1.getMutualFriends);
router.get('/search', validagtions_1.userSearchRules, reqValidator_1.validateRequest, userController_1.searchUsers);
router.patch('/:id', validagtions_1.userUpdateRules, reqValidator_1.validateRequest, userController_1.updateUser);
exports.default = router;
