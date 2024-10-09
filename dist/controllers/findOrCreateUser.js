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
const dbConnection_1 = __importDefault(require("../utils/dbConnection"));
function findOrCreateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.user) {
            const user = req.user._json;
            try {
                const existingUser = yield dbConnection_1.default.users.findFirst({
                    where: {
                        id: user.sub
                    }
                });
                if (!existingUser) {
                    const newUser = yield dbConnection_1.default.users.create({
                        data: {
                            id: user.sub,
                            email: user.email,
                            name: user.name,
                            dp: user.picture,
                            sub: user.sub
                        },
                    });
                    return res.json({ newUser: newUser });
                }
                res.json({ user: existingUser });
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
module.exports = { findOrCreateUser };
