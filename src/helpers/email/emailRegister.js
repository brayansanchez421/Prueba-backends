import nodemailer from "nodemailer";
import User from "../../models/user/user.model.js";

import { setSend } from "../setSend.js";


export const sendRegistrationEmail = async (email, name, userSaved) => {
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
      subject: "Account activation",
      html: ` <!DOCTYPE html> <html lang="es"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Account activation</title> <style> body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }.btn {
          display: block;
          width: 200px;
          margin: 20px auto;
          padding: 10px;
          text-align: center;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
      }
  
      .btn:hover {
          background-color: #0056b3;
      } .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: black; } .logo { max-width: 100px; display: block; margin: 0 auto; } h1 { color: #007bff; /* Azul */ } p { color: #ccc; /* Gris claro para los párrafos */ } strong { color: #007bff; /* Azul para los textos en negrita */ } </style> </head> <body> <div class="container"> <img src="https://media.discordapp.net/attachments/1214959339413180517/1224352644148101140/doko_avatar_new.png?ex=662fa341&is=661d2e41&hm=1792584a263e87ccb6aa3f4a7b3931479bfc00c9f4609643a80d685444568d6b&=&format=webp&quality=lossless&width=543&height=498" alt="Logo de la empresa" class="logo"> <div>
      <h1>¡Congratulation! you have been regitstered succesfully</h1>
      <p>Hola ${name},</p>
      <p>We are happy to have you with us. activate your account by clicking this link:</p>
      <p><a href="http://localhost:3068/PE/activation/${userSaved._id}">Here!</a></p>
  </div>  </body> </html> `,
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject("Failed to send email notification");
        } else {
          console.log("Email sent: " + info.response);
          resolve("Registration email sent successfully");
        }
      });
    });
  };

  export const sendDeleteUserEmail = async (email) => {
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
      subject: "User Deleted ",
      html: `<!DOCTYPE html>
      <html lang="es">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Usuario eliminado con éxito</title>
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
      <h1>your account have been succesfully deleted.</h1>
      <p>See you soon.</p>
      <p>If you need help, comunicate with one of the administrators.</p>
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
          resolve("Delete user email sent successfully");
        }
      });
    });
  };

  export const sendDeleteAccountConfirmationEmail = async (email, confirmationCode) => {
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
        subject: "Confirmation Code for Account Deletion",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation Code for Account Deletion</title>
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
        <h1>Confirmation Code for Account Deletion</h1>
        <p>To delete your account, use the following confirmation code:</p>
        <p><strong>${confirmationCode}</strong></p>
        <p>If you did not request this deletion, please contact one of the administrators.</p>
        </div>
        </body>
        </html>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return setSend("Confirmation code email sent successfully");
    } catch (error) {
        console.error(error);
        return setSend("Failed to send confirmation code email");
    }
};

