"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGoogleRoute = void 0;
const passport_1 = __importDefault(require("../utils/passport"));
const findOrCreateUser_controller_1 = require("../controllers/user/findOrCreateUser.controller");
const express = require("express");
const router = express.Router();
exports.authGoogleRoute = router;
router.get('/auth/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
}));
router.get('/auth/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: "https://jsrsoftcare.com"
}), findOrCreateUser_controller_1.findOrCreateUser);
