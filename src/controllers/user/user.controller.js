import User from "../../models/user/user.model.js";
import Role from '../../models/user/role.models.js';
import bcrypt from 'bcryptjs';

import { setSend } from "../../helpers/setSend.js";
import {sendDeleteAccountConfirmationEmail, sendDeleteUserEmail, sendRegistrationEmailWithTemporaryPassword} from "../../helpers/email/emailRegister.js"

export const createUser = async (req, res) => {
    const { username, email, role } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(setSend("Email already exists"));
        }

        // Buscar el ID del rol por nombre
        const roleObject = await Role.findOne({ nombre: role });
        if (!roleObject) {
            return res.status(404).json({ msg: 'Role not found' });
        }

        // Generar una contraseña temporal aleatoria
        const temporaryPassword = Math.random().toString(36).substring(2, 10);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);


        // Crear el nuevo usuario con el ID del rol encontrado
        const newUser = new User({ username, email, password: hashedPassword, role: roleObject._id });
        const userSaved = await newUser.save();

        // Enviar el correo electrónico de registro con la contraseña temporal
        await sendRegistrationEmailWithTemporaryPassword(email, username, temporaryPassword);

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
            message: "Successful registration. Check your email for the temporary password.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, state, role } = req.body;

    try {
        // Buscar el ID del rol por nombre
        const roleObject = await Role.findOne({ nombre: role });
        if (!roleObject) {
            return res.status(404).json({ msg: 'Role not found' });
        }

        // Actualizar el usuario con el ID del rol encontrado
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, state, role: roleObject._id }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
};


export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json(setSend( "User not found" ));
        }

        // Obtener el nombre del rol asociado al usuario
        const role = await Role.findById(user.role); // Suponiendo que el campo "role" contiene el _id del rol
        if (!role) {
            return res.status(404).json(setSend( "Role not found" ));
        }

        // Modificar la respuesta para incluir el nombre del rol en lugar del _id
        const userWithRoleName = { ...user.toJSON(), role: role.nombre };

        res.json(userWithRoleName);
    } catch (error) {
        res.status(500).json(setSend( "Internal server error" ));
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'nombre'); // Hacer el populate solo en el campo 'nombre'
        const usersWithRoleNames = users.map(user => ({
            ...user._doc,
            role: user.role.nombre // Reemplazar el objeto 'role' con el campo 'nombre'
        }));
        res.json(usersWithRoleNames);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};




export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json(setSend("User not found"));
        }

        const deleteCode = generateConfirmationCode();
        user.deleteCode = deleteCode;
        user.deleteCodeExpires = Date.now() + 3600000; 
        await user.save();

        await sendDeleteAccountConfirmationEmail(user.email, deleteCode);

        res.status(200).json(setSend("Confirmation code sent successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};

export const deleteUserConfirmation = async (req, res) => {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json(setSend("User not found"));
        }

        if (user.deleteCode !== confirmationCode) {
            return res.status(400).json(setSend("Invalid confirmation code"));
        }

        await User.findByIdAndDelete(id);

        await sendDeleteUserEmail(user.email);

        res.status(200).json(setSend("User deleted successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};

const generateConfirmationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let confirmationCode = '';

    for (let i = 0; i < 6; i++) {
        confirmationCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return confirmationCode;
};