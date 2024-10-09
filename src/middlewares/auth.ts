import {NextFunction, Request, Response} from "express"
import { CustomRequest } from '../../types';
const jwt = require('jsonwebtoken');

const authMiddleware = (req:CustomRequest, res:Response, next:NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Login to access.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
