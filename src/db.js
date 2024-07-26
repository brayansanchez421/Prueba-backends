import mongoose from "mongoose";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

export const connectDB = async () => {
    const mongoURI = "mongodb+srv://sanchezcortesbrayan:Wlcr9dz6Ql1SvmmS@brightmind.bkeumrn.mongodb.net/plataforma?retryWrites=true&w=majority&appName=brightmind";

    try {
        await mongoose.connect(mongoURI);
        console.log("se ha conectado JAJAJAJa");

        // Verifica la conexión a la base de datos en la ruta
        app.get('/status', async (req, res) => {
            try {
                await mongoose.connection.db.command({ ping: 1 });
                res.status(200).send('Conexión a la base de datos exitosa');
            } catch (error) {
                res.status(500).send('Error al conectar con la base de datos');
            }
        });
    } catch (error) {
        console.log(error);
        // Maneja el error de conexión si es necesario
    }
};

// Inicia el servidor Express
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

// Conecta a la base de datos
connectDB();
