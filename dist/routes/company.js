"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRoute = void 0;
const createCompany_controller_1 = require("../controllers/company/createCompany.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const express = require("express");
const router = express.Router();
exports.companyRoute = router;
router.post('/company', auth_1.default, createCompany_controller_1.createCompany);
router.get('/company', auth_1.default, createCompany_controller_1.createCompany);
