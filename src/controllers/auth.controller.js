import User from "../models/user/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { setSend } from "../helpers/setSend.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import {sendResetCodeEmail} from "../helpers/email/emailService.js"
import {sendResetEmail} from "../helpers/email/emailReset.js"
import {sendRegistrationEmail} from "../helpers/email/emailRegister.js"
import passport from "passport";
import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(setSend("User not found"));
    }

    const resetCode = Math.random().toString(36).substring(2, 8);
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 3600000);
    await user.save();

    const result = await sendResetCodeEmail(email, resetCode);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json(setSend("Internal server error"));
  }
};

export const resetPasswordVerify = async (req, res) => {
  const { resetCode } = req.body;

  try {
    const user = await User.findOne({
      resetCode,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log('Invalid reset code or expired');
      return res.status(400).json(setSend("Invalid reset code or expired"));
    }

    return res.status(200).json(setSend("Valid reset code", { email: user.email }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(setSend("Internal server error"));
  }
};

export const passwordReset = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json(setSend("Passwords do not match"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(setSend("Invalid email"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    const result = await sendResetEmail(email);
    console.log('Email sent:', result);
    return res.status(200).json(setSend(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json(setSend("Internal server error"));
  }
};




export const register = async (req, res) => {
  try {
    const { username, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash});
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id, role: userSaved.role });

    await sendRegistrationEmail(email, username, userSaved);

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      message: "successful registration",
      token: token
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json(setSend("email already exits"));
    } else {
      res.status(500).json(setSend("Internal server error"));
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email }).populate('role', 'nombre');
    if (!userFound) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect Password" });
    }

    if (!userFound.state) {
      return res.status(400).json({ success: false, message: "Invalid user" });
    }

    const token = await createAccessToken({
      email: userFound.email,
      id: userFound._id,
      role: userFound.role,
      courses: userFound.courses,

    });

    res.cookie("token", token);
    res.json({
      success: true,
      data: {
        id: userFound._id,
        username: userFound.username,
        role: userFound.role.nombre,
        email: userFound.email,
        courses: userFound.courses,

        createAt: userFound.createdAt,
        updateAt: userFound.updatedAt,
        token: token
      },
      message: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  return res.status(200).send("successful Logout");
};

export const activate = async (req, res) => {  
  const { _id } = req.params;
  try {
    const userFound = await User.findById(_id);

    if (!userFound) {
      return res.status(404).json(setSend( "Usuario no encontrado" ));
    }

    userFound.state = !userFound.state;
    await userFound.save();

    return res.redirect('http://localhost:5173/activate');
  } catch (error) {
    return res.status(500).json(setSend( "Error en el servidor al activar usuario", error ));
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  console.log("Token recibido:", token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) {
      console.error("Error al verificar el token:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Datos del usuario del token:", user);
    const userFound = await User.findOne({ email: user.email });
    console.log("Usuario encontrado:", userFound);

    if (!userFound) {
      console.error("Usuario no encontrado:");
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Datos del usuario encontrados:", {
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      courses: userFound.courses,

    });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      courses: userFound.courses,

    });
  });
};