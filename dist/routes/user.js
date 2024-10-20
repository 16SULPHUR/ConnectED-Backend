"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const getUser_1 = __importDefault(require("../controllers/user/getUser"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const express = require("express");
const router = express.Router();
exports.userRoute = router;
router.get('/', auth_1.default, getUser_1.default);
