import Course from '../../models/courses/course.model.js'
import Category from '../../models/courses/category.model.js'


export const createCategory = async (req, res) => {
    const { name } = req.body;

    try {       
        
        const newCategory = new Category({name});
        const savedCategory = await newCategory.save();

        res.json({
            id: savedCategory._id,
            name: savedCategory.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

