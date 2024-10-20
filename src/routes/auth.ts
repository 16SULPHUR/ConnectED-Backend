import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
  instituteEmail: z.string().email(),
  personalEmail: z.string().email(),
  name: z.string(),
  password: z.string().min(6),
  dob: z.string().transform(str => new Date(str)),
  graduationYear: z.string().transform(str => new Date(str)),
  admissionYear: z.string().transform(str => new Date(str)),
  role: z.enum(['STUDENT', 'ALUMINI', 'ADMIN']),
  occupation: z.string().optional(),
  socialLinks: z.array(z.string()).optional()
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
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
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.users.create({
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
    const token = jwt.sign(
      { userId: newUser.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

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

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  try {
      const validatedData = signinSchema.parse(req.body);
      console.log(validatedData)
    
    // Find user by email
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { instituteEmail: validatedData.email },
          { personalEmail: validatedData.email }
        ]
      }
    });

    console.log(user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(validatedData.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

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

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;