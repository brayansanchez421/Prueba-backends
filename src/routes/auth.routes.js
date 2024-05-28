import { Router } from "express";
import { login, register, logout, activate, resetPassword, resetPasswordVerify, passwordReset } from "../controllers/auth.controller.js";

import passport from "passport";
const router = Router();

router.post("/register", register);
router.post("/login",  login);
router.post('/logout', logout);
router.get('/activation/:_id', activate );
router.post('/reset-password', resetPassword);
router.post('/verify', resetPasswordVerify);
router.post('/passwordReset', passwordReset);


router.get('/auth/google',
  passport.authenticate('google', {scope: ['email', 'profile']})
)
router.get('/callback',
  passport.authenticate('google', {successRedirect: '/success'})
)
router.get('/success', (req, res) =>{
    res.send(req.user.displayName)
}
)


export default router;
