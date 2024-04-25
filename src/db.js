import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost/prueba2");
        console.log("se ha conectado JAJAJAJa")
    } catch (error) {
        console.log(error);
    }
};

