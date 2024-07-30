// src/controllers/auth.controller.js
import User from "../models/user/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import { sendResetCodeEmail } from "../helpers/email/emailService.js";
import { sendResetEmail } from "../helpers/email/emailReset.js";
import { sendRegistrationEmail } from "../helpers/email/emailRegister.js";
import { setSend } from "../helpers/setSend.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash });
    const userSaved = await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: userSaved._id, role: userSaved.role },
      TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    await sendRegistrationEmail(email, username, userSaved);

    // Set token in cookie
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
      res.status(400).json(setSend("Email already exists"));
    } else {
      res.status(500).json(setSend("Internal server error"));
    }
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email }).populate('role', 'nombre');
    if (!userFound) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect Password" });
    }

    if (!userFound.state) {
      return res.status(400).json({ success: false, message: "Invalid user" });
    }

    // Create JWT token
    const token = jwt.sign({
      email: userFound.email,
      id: userFound._id,
      role: userFound.role,
      courses: userFound.courses
    }, TOKEN_SECRET, { expiresIn: '1h' });

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.json({
      success: true,
      data: {
        id: userFound._id,
        username: userFound.username,
        role: userFound.role.nombre,
        email: userFound.email,
        courses: userFound.courses,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
        token: token
      },
      message: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Logout user
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });
  return res.status(200).send("Successful Logout");
};

// Reset password - request reset code
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(setSend("User not found"));
    }

    const resetCode = Math.random().toString(36).substring(2, 8);
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const result = await sendResetCodeEmail(email, resetCode);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json(setSend("Internal server error"));
  }
};

// Verify reset code
export const resetPasswordVerify = async (req, res) => {
  const { resetCode } = req.body;

  try {
    const user = await User.findOne({ resetCode });

    if (!user) {
      return res.status(400).json(setSend("Invalid reset code or expired"));
    }

    res.cookie("resetCode", resetCode, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return res.status(200).json(setSend("Valid reset code", { email: user.email }));
  } catch (error) {
    console.error(error);
    return res.status(500).json(setSend("Internal server error"));
  }
};

// Reset password
export const passwordReset = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const resetCode = req.cookies.resetCode;

  if (!resetCode) {
    return res.status(400).json(setSend("Reset code is required"));
  }

  if (password !== confirmPassword) {
    return res.status(400).json(setSend("Passwords do not match"));
  }

  try {
    const user = await User.findOne({ resetCode });

    if (!user) {
      return res.status(400).json(setSend("Invalid reset code or expired"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.clearCookie("resetCode");

    const result = await sendResetEmail(user.email);
    return res.status(200).json(setSend(result));
  } catch (error) {
    console.error(error);
    return res.status(500).json(setSend("Internal server error"));
  }
};

// Activate user
export const activate = async (req, res) => {  
  const { _id } = req.params;
  try {
    const userFound = await User.findById(_id);

    if (!userFound) {
      return res.status(404).json(setSend("User not found"));
    }

    userFound.state = !userFound.state;
    await userFound.save();

    return res.redirect('http://localhost:5173/activate');
  } catch (error) {
    return res.status(500).json(setSend("Server error while activating user", error));
  }
};

// Verify JWT token
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userFound = await User.findOne({ email: user.email });

    if (!userFound) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      courses: userFound.courses
    });
  });
};
