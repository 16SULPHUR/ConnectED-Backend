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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const session = require("express-session");
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("./utils/passport"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
require('dotenv').config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
const authGoogle_1 = require("./routes/authGoogle");
const user_1 = require("./routes/user");
const company_1 = require("./routes/company");
app.use('/', authGoogle_1.authGoogleRoute);
app.use('/api', user_1.userRoute);
app.use('/api', company_1.companyRoute);
const LINKEDIN_CLIENT_ID = '77c9041mhsy6zy';
const LINKEDIN_CLIENT_SECRET = 'IN00kxr8T7rpyOXd';
app.get('/li', (req, res) => {
    res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&scope=email%20profile%20openid&redirect_uri=http://localhost:8080/auth/linkedin/callback`);
});
app.get('/auth/linkedin/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: 'http://localhost:8080/auth/linkedin/callback',
        grant_type: 'authorization_code',
        code: req.query.code
    };
    const { data } = yield axios_1.default.post('https://www.linkedin.com/oauth/v2/accessToken', qs_1.default.stringify(payload), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    res.json(data);
}));
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">SIGNUP</a>');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
