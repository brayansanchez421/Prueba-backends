import Course from '../../models/courses/course.model.js'
import Category from '../../models/courses/category.model.js'

import { setSend } from "../../helpers/setSend.js";

export const getCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json(setSend( "Course not found" ));
        }

        const category = await Category.findById(course.category);
        if (!category) {
            return res.status(404).json(setSend( "The course doesnt have any category", category ));
        }

        const CourseWithCategoryName = { ...course.toJSON(), category: category.name };

        res.json(CourseWithCategoryName);
    } catch (error) {
        res.status(500).json(setSend( "Internal server error" ));
    }
};


export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('category', 'name'); 
        const coursesWithCategoryNames = courses.map(course => ({
            ...course._doc,
            category: course.category.name 
        }));
        res.json(coursesWithCategoryNames);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const createCourse = async (req, res) => {
    const { title, description, category: categoryName } = req.body;
    const file = req.file; // Obtener el archivo de imagen del cuerpo de la solicitud

    try {
        console.log("Datos recibidos en la solicitud:", { title, description, categoryName,  file });

        // Buscar la categoría por nombre
        const category = await Category.findOne({ name: categoryName });

        // Si no se encuentra la categoría, devolver un error
        if (!category) {
            console.log("Categoría no encontrada:", categoryName);
            return res.status(404).json({ msg: "Category not found" });
        }

        let imagePath = ''; // Inicializar la variable para almacenar la ruta de la imagen

        // Si se ha enviado un archivo de imagen
        if (file) {
            imagePath = file.path; // Obtener la ruta del archivo de imagen
        }

        // Si se ha enviado un archivo de contenido
      

        // Crear una nueva instancia del curso con los datos recibidos
        const newCourse = new Course({
            title,
            description,
            image: imagePath, // Guardar la ruta de la imagen en el campo 'image'
            category: category._id, // Usar el ID de la categoría encontrada
        });

        // Guardar el nuevo curso en la base de datos
        const savedCourse = await newCourse.save();

        // Log para verificar los datos guardados
        console.log("Nuevo curso guardado:", savedCourse);

        // Responder con el curso guardado
        res.json({
            id: savedCourse._id,
            title: savedCourse.title,
            description: savedCourse.description,
            image: savedCourse.image,
            category: category.name, // Devolver el nombre de la categoría en la respuesta
            createdAt: savedCourse.createdAt,
            updatedAt: savedCourse.updatedAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};



export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, content } = req.body;
    const file = req.file;

    try {
        console.log(`Updating course with ID: ${id}`);
        console.log(`Received data: title=${title}, description=${description}, category=${category}, content=${content}`);

        const categoryObject = await Category.findOne({ name: category });
        if (!categoryObject) {
            console.log(`Category not found: ${category}`);
            return res.status(404).json({ msg: 'Category not found' });
        }

        let updateData = { title, description, category: categoryObject._id, content };

        // Si se ha enviado un archivo de imagen
        if (file) {
            updateData.image = file.path; // Obtener la ruta del archivo de imagen
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCourse) {
            console.log(`Course not found: ${id}`);
            return res.status(404).json({ msg: 'Course not found' });
        }
        
        console.log(`Course updated successfully: ${updatedCourse}`);
        res.json(updatedCourse);
    } catch (error) {
        console.error(`Error updating course: ${error}`);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
export const asignarContenido = async (req, res) => {
    const { id } = req.params;
    const contentPath  = req.file.path; // Obtener el path del archivo de contenido del cuerpo de la solicitud

    console.log("verificacion: ", contentPath)
    console.log("verificacion1: ", req.file)

    

    try {
        // Buscar el curso por ID
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json(setSend("Course not found"));
        }

        // Asignar el contenido al curso
        course.content.push(contentPath);
        
        // Guardar el curso actualizado en la base de datos
        const savedCourse = await course.save();

        // Log para verificar los datos guardados
        console.log("Contenido asignado al curso:", savedCourse);

        // Responder con el curso actualizado
        res.json({
            id: savedCourse._id,
            title: savedCourse.title,
            description: savedCourse.description,
            image: savedCourse.image,
            category: savedCourse.category,
            content: savedCourse.content,
            createdAt: savedCourse.createdAt,
            updatedAt: savedCourse.updatedAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};





export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json(setSend("Course not found"));
        }
        await Course.findByIdAndDelete(id);
        res.status(200).json(setSend("course deleted successfully"));

    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};


export const getCoursesByCategory = async (req, res) => {
    const { categoryName } = req.params;

    try {
        console.log("Buscando categoría:", categoryName);

        // Buscar la categoría por nombre
        const category = await Category.findOne({ name: categoryName });

        console.log("Categoría encontrada:", category);

        if (!category) {
            return res.status(404).json(setSend("Category not found"));
        }

        // Buscar todos los cursos que pertenezcan a la categoría encontrada
        const courses = await Course.find({ category: category._id }).populate('category', 'name');

        console.log("Cursos encontrados:", courses);

        if (!courses.length) {
            return res.status(404).json(setSend("No courses found for this category"));
        }

        const coursesWithCategoryName = courses.map(course => ({
            ...course._doc,
            category: course.category.name
        }));

        // Responder con los cursos encontrados
        res.json(coursesWithCategoryName);
    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};