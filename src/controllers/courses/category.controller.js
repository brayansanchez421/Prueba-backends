import Category from '../../models/courses/category.model.js';

// Crear una nueva categoría
export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    const file = req.file; // Obtener el archivo de imagen del cuerpo de la solicitud

    try {
        let imagePath = ''; // Inicializar la variable para almacenar la ruta de la imagen

        // Si se ha enviado un archivo de imagen
        if (file) {
            imagePath = file.path; // Obtener la ruta del archivo de imagen
        }
        
        // Crear una nueva instancia de la categoría con los datos recibidos
        const newCategory = new Category({
            name,
            image: imagePath, // Guardar la ruta de la imagen en el campo 'image'
            description
        });
        console.log(file)
        console.log(imagePath)
        console.log(newCategory)
        // Guardar la nueva categoría en la base de datos
        const savedCategory = await newCategory.save();

        // Responder con la categoría guardada
        res.json({
            id: savedCategory._id,
            name: savedCategory.name,
            image: savedCategory.image,
            description: savedCategory.description
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Obtener todas las categorías
export const getCategories = async (req, res) => {
    try {
        // Buscar todas las categorías en la base de datos
        const categories = await Category.find({});
        
        // Responder con la lista de categorías
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

