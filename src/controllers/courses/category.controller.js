import Category from '../../models/courses/category.model.js'

// Crear una nueva categoría
export const createCategory = async (req, res) => {
    const { name, image, description } = req.body;

    try {       
        // Crear una nueva instancia de la categoría con los datos recibidos
        const newCategory = new Category({
            name,
            image,
            description
        });

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
