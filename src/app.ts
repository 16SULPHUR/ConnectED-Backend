import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
const session = require("express-session")
import axios from 'axios';
import qs from 'qs';
require('dotenv').config();
import { CustomRequest } from "../types";

import authRouter from './routes/auth';
import postRouter from './routes/posts';
import prisma from './utils/prisma';

const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use('/api/auth', authRouter);
app.use('/api/', postRouter);

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
