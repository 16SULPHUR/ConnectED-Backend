import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
const session = require("express-session")
import axios from 'axios';
import qs from 'qs';
require('dotenv').config();


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



import { userRoute } from './routes/user'

app.use('/user', userRoute);

function isLoggedIn(req: any, res: any, next: any) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}



import { CustomRequest } from "../types";
app.get('/profile', isLoggedIn, function (req: CustomRequest, res) {
  console.log(req?.user)
  res.send("HII")
});


app.get('/', (req: Request, res: Response) => {
  res.send('<a href="/auth/google">SIGNUP</a>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
