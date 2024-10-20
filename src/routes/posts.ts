import express, { Request, Response } from 'express';
import { z } from 'zod';
import prisma from './../utils/prisma'; // Assuming Prisma is set up in utils
import { authenticateToken } from './../middlewares/auth';
import { CustomRequest } from '../../types'; // Custom request type for adding user info

const router = express.Router();

const createPostSchema = z.object({
    content: z.string().min(1, "Content cannot be empty"),
    imageUrls: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
});

// API to get all posts
router.get('/posts', authenticateToken, async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({

        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// API to create a new post
router.post('/posts', authenticateToken, async (req: CustomRequest, res: Response) => {
    try {
        const validatedData = createPostSchema.parse(req.body);

        console.log(req.user)
        if (req.user) {
            const newPost = await prisma.post.create({
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

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors }); // Handle validation error
        } else {
            console.log(error)
            res.status(500).json({ error: "Failed to create post" });
        }
    }
});

export default router;
