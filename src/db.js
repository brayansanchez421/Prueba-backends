import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoURI = "mongodb+srv://sanchezcortesbrayan:Wlcr9dz6Ql1SvmmS@brightmind.bkeumrn.mongodb.net/plataforma?retryWrites=true&w=majority&appName=brightmind";

    try {
        await mongoose.connect(mongoURI);
        console.log("se ha conectado JAJAJAJa");
    } catch (error) {
        console.log(error);
    }
};
