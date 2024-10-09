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
exports.findOrCreateUser = findOrCreateUser;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createJWT_1 = __importDefault(require("../../utils/createJWT"));
function findOrCreateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.user) {
            const user = req.user._json;
            try {
                const existingUser = yield prisma_1.default.users.findFirst({
                    where: {
                        id: user.sub
                    }
                });
                if (!existingUser) {
                    const newUser = yield prisma_1.default.users.create({
                        data: {
                            id: user.sub,
                            email: user.email,
                            name: user.name,
                            dp: user.picture,
                            sub: user.sub
                        },
                    });
                    const jwt = (0, createJWT_1.default)(newUser.id);
                    return res.redirect(`${process.env.FRONTEND_REDIRECT_URL_FOR_SIGNIN}/?token=${jwt}`);
                }
                const jwt = (0, createJWT_1.default)(existingUser.id);
                return res.redirect(`${process.env.FRONTEND_REDIRECT_URL_FOR_SIGNIN}/?token=${jwt}`);
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Error creating or finding user');
            }
        }
        else {
            res.status(400).send('User not found in session');
        }
    });
}
