"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
function createJWT(id) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}
exports.default = createJWT;
