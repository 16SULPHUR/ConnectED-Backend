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
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("./../utils/prisma")); // Assuming Prisma is set up in utils
const auth_1 = require("./../middlewares/auth");
const router = express_1.default.Router();
const createPostSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Content cannot be empty"),
    imageUrls: zod_1.z.array(zod_1.z.string().url()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
// API to get all posts
router.get('/posts', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma_1.default.post.findMany({});
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
}));
// API to create a new post
router.post('/posts', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = createPostSchema.parse(req.body);
        console.log(req.user);
        if (req.user) {
            const newPost = yield prisma_1.default.post.create({
                data: {
                    content: validatedData.content,
                    imageUrls: validatedData.imageUrls || [],
                    authorId: req.user.userId,
                    likes: 0,
                    tags: validatedData.tags || [],
                    // comments: []
                },
            });
            res.status(201).json(newPost);
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors }); // Handle validation error
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Failed to create post" });
        }
    }
}));
exports.default = router;
