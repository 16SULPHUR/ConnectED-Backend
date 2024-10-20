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
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Validation schemas
const signupSchema = zod_1.z.object({
    instituteEmail: zod_1.z.string().email(),
    personalEmail: zod_1.z.string().email(),
    name: zod_1.z.string(),
    password: zod_1.z.string().min(6),
    dob: zod_1.z.string().transform(str => new Date(str)),
    graduationYear: zod_1.z.string().transform(str => new Date(str)),
    admissionYear: zod_1.z.string().transform(str => new Date(str)),
    role: zod_1.z.enum(['STUDENT', 'ALUMINI', 'ADMIN']),
    occupation: zod_1.z.string().optional(),
    socialLinks: zod_1.z.array(zod_1.z.string()).optional()
});
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
// Signup route
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = signupSchema.parse(req.body);
        // Check if user already exists
        const existingUser = yield prisma.users.findFirst({
            where: {
                OR: [
                    { instituteEmail: validatedData.instituteEmail },
                    { personalEmail: validatedData.personalEmail }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(validatedData.password, 10);
        const newUser = yield prisma.users.create({
            data: {
                instituteEmail: validatedData.instituteEmail,
                personalEmail: validatedData.personalEmail,
                name: validatedData.name,
                password: hashedPassword, // Use hashed password here
                dob: validatedData.dob,
                graduationYear: validatedData.graduationYear,
                admissionYear: validatedData.admissionYear,
                role: validatedData.role,
                occupation: validatedData.occupation,
                socialLinks: validatedData.socialLinks || []
            }
        });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                userId: newUser.userId,
                name: newUser.name,
                instituteEmail: newUser.instituteEmail,
                role: newUser.role
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Signin route
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = signinSchema.parse(req.body);
        console.log(validatedData);
        // Find user by email
        const user = yield prisma.users.findFirst({
            where: {
                OR: [
                    { instituteEmail: validatedData.email },
                    { personalEmail: validatedData.email }
                ]
            }
        });
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const validPassword = yield bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                userId: user.userId,
                name: user.name,
                instituteEmail: user.instituteEmail,
                role: user.role
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
