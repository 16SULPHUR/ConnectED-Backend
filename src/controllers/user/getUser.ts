import { Request, Response } from 'express';
import prisma from "../../utils/prisma";
import { CustomRequest } from '../../../types';

export default async function getUser(req:CustomRequest, res:Response) {

    const userId = req.user?.id || "";
    const user:any = await prisma.users.findFirst({
        where: {
          userId: userId
        }
      })
    

    res.json({user:user})

} 
