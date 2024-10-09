"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = createCompany;
const prisma_1 = __importDefault(require("../../utils/prisma"));
function createCompany(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "";
        try {
            const body = req.body;
            if (!userId) {
                return res.status(404).json({ status: "failed", message: "user not found" });
            }
            console.log(body);
            const newCompany = yield prisma_1.default.companies.create({
                data: {
                    createdBy: userId,
                    name: body.name,
                    address: body.address,
                    GSTNumber: body.GSTNumber,
                    PANNumber: body.PANNumber,
                    TDSNumber: body.TDSNumber || null,
                    phone: body.phone || null,
                    email: body.email || null
                }
            });
            console.log(newCompany);
            return res.json({ msg: newCompany });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ status: "failed", message: "internal server error" });
        }
    });
}
