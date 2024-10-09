import getUser from "../controllers/user/getUser";
import authMiddleware from "../middlewares/auth";

const express = require("express")

const router = express.Router()

router.get('/', authMiddleware, getUser)
    
export {router as userRoute};