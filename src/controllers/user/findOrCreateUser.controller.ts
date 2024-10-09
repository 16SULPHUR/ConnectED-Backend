import { Request, Response } from 'express';
import { CustomRequest } from '../../../types';
import prisma from '../../utils/prisma';
import createJWT from '../../utils/createJWT';
import { randomUUID } from 'crypto';

async function findOrCreateUser(req: CustomRequest, res: Response) {
  if (req.user) {
    const user = req.user._json;

    try {

      const existingUser = await prisma.users.findFirst({
        where: {
          userId: user.sub
        }
      })

      if (!existingUser) {

        const newUser = await prisma.users.create({
          data: {
            userId: randomUUID(),
            email: user.email,
            name: user.name,
            dp: user.picture,
            sub: user.sub
          },
        });

        const jwt = createJWT(newUser.userId);

        return res.redirect(`${process.env.FRONTEND_REDIRECT_URL_FOR_SIGNIN}/?token=${jwt}`)
      }

      const jwt = createJWT(existingUser.userId);

      return res.redirect(`${process.env.FRONTEND_REDIRECT_URL_FOR_SIGNIN}/?token=${jwt}`)

    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating or finding user');
    }
  } else {
    res.status(400).send('User not found in session');
  }
}

export { findOrCreateUser };
