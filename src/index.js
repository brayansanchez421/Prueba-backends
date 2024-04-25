import app from "./app.js";
import { connectDB } from "./db.js";
const PORT = process.env.PORT | 2500;
import('./authG/googleAuth.js')
connectDB();




app.listen(PORT, () =>
  console.log("escuchando por el puerto y estoy ejecutando desde index", PORT)
);



app.get('/', (req, res)=> {
  res.send('<a href="PE/auth/google"> Registrarse con google </a>')
})

