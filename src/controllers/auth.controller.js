import User from "../models/user/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { setSend } from "../helpers/setSend.js";
import { sendResetCodeEmail } from "../helpers/email/emailService.js";
import { sendResetEmail } from "../helpers/email/emailReset.js";
import { sendRegistrationEmail } from "../helpers/email/emailRegister.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash });
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id, role: userSaved.role });

    await sendRegistrationEmail(email, username, userSaved);

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
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
      res.status(400).json(setSend("email already exists"));
    } else {
      res.status(500).json(setSend("Internal server error"));
    }
  }
};

// Inicio de sesión
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

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
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

// Logout
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });
  return res.status(200).send("successful Logout");
};

// Verificación del Token
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) {
      console.error("Error al verificar el token:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFound = await User.findOne({ email: user.email });
    if (!userFound) {
      console.error("Usuario no encontrado:");
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      courses: userFound.courses,
    });
  });
};
