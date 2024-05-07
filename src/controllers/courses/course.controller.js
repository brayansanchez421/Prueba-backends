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
    const { title, description, image, category } = req.body;

    try {       
     
        const newCourse = new Course({ title, description, image, category});
        const savedCourse = await newCourse.save();

        res.json({
            id: savedCourse._id,
            title: savedCourse.title,
            description: savedCourse.description,
            category : savedCourse.category,
            createdAt: savedCourse.createdAt,
            updatedAt: savedCourse.updatedAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(setSend("Internal server error"));
    }
};


export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, category } = req.body;

    try {
   
        const categoryObject = await Category.findOne({ name: category });
        if (!categoryObject) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, { title, description, image, category: categoryObject._id }, { new: true });
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
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


