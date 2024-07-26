import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoURI = "mongodb://mongo:UeIGycJgqljTDECTDmGuLnqhQacfYFKl@viaduct.proxy.rlwy.net:33294";

    try {
        await mongoose.connect(mongoURI);
        console.log("se ha conectado JAJAJAJa");
    } catch (error) {
        console.log(error);
    }
};
