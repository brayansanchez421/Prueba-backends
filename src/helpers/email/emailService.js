
import nodemailer from "nodemailer";
import { setSend } from "../setSend.js";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetCodeEmail = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Change your password!",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change your password here</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    strong {
      font-size: 24px; 
      color: #007bff;
    }
    h1 {
      color: #007bff;
    }
    p {
      color: #333;
    }
    </style>
    </head>
    <body>
    <div class="container">
    <h1>Password recovery</h1>
    <p>To change your password use the following code in the main page:</p>
    <p><strong>${resetCode}</strong></p>
    <p>if you did not ask for this code please get in contact with one of the admins</p>
    </div>
    </body>
    </html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return setSend("Reset code sent successfully");
  } catch (error) {
    console.error(error);
    return setSend("Failed to send reset code");
  }
};


