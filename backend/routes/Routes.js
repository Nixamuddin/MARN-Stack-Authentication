import  express from "express";
import { Register, forgotPassword, login, resetpassword } from "../controllers/controller.js";
const router=express.Router();
router.post('/register',Register)
router.post('/login',login)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpassword',resetpassword)
export default router;