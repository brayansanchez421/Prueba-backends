import app from "./app.js";
import { connectDB } from "./db.js";




// Escuchando en un puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


app.get("/", (req, res) => {
  const htmlResponse = `
    <html>
      <head>
        <title> NodeJs y Express en Vercel</title>
      </head>
      <body>
        <h1>Esta Funcionando back end en Vercel</h1>
      </body>
    </html>
  `;
  res.send(htmlResponse);
});
