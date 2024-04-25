import nodemailer from "nodemailer";
import { setSend } from "../setSend.js";
import dotenv from "dotenv";
dotenv.config();

export const sendResetEmail = async (email) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password changed succesfully",
      html: `<!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your password has been changed correctly</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .logo {
          max-width: 100px;
          display: block;
          margin: 0 auto;
        }
        h1 {
          color: #007bff; 
        }
        p {
          color: #333;
        }
        strong {
          color: #007bff;
        }
        </style>
        </head>
        <body>
        <div class="container">
        <img src="https://media.discordapp.net/attachments/1214959339413180517/1224352644148101140/doko_avatar_new.png?ex=662fa341&is=661d2e41&hm=1792584a263e87ccb6aa3f4a7b3931479bfc00c9f4609643a80d685444568d6b&=&format=webp&quality=lossless&width=543&height=498" alt="Logo de la empresa" class="logo">
        <h1>Password changed succesfully.</h1>
        <p>your Password has been succesfully edited </p>
        </div>
        </body>
        </html>`,
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject("Failed to send email notification");
        } else {
          console.log("Email sent: " + info.response);
          resolve("Password reset successfully");
        }
      });
    });
  };