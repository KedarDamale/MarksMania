import { StudentDetails } from "../models/student_details.model.js";
import { Subjects } from "../models/subjects.model.js";
import { StudentMarks } from "../models/student_marks_model.js";
import mongoose from "mongoose";

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//
// STUDENT OPERATIONS
//

// Create a new student
export const createStudent = async (req, res) => {
    const { student_reg, student_name, student_branch, student_graduation_year, student_batch, student_rollno } = req.body;

    try {
        const newStudent = new StudentDetails({
            student_reg,
            student_name,
            student_branch,
            student_graduation_year,
            student_batch,
            student_rollno,
        });

        await newStudent.save();
        res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await StudentDetails.find();
        res.status(200).json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a student
export const updateStudent = async (req, res) => {
    const { studentId } = req.params;
    const updates = req.body;

    try {
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: "Invalid student ID format." });
        }

        const updatedStudent = await StudentDetails.findByIdAndUpdate(studentId, updates, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a student
export const deleteStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: "Invalid student ID format." });
        }

        const deletedStudent = await StudentDetails.findByIdAndDelete(studentId);
        if (!deletedStudent) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//
// SUBJECT OPERATIONS
//

// Create a new subject
export const createSubject = async (req, res) => {
    const { subject_name, branch, semester, subject_code } = req.body;

    try {
        const newSubject = new Subjects({ subject_name, branch, semester, subject_code });
        await newSubject.save();
        res.status(201).json({ message: "Subject created successfully", subject: newSubject });
    } catch (error) {
        console.error("Error creating subject:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all subjects
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subjects.find();
        res.status(200).json({ subjects });
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a subject
export const updateSubject = async (req, res) => {
    const { subjectId } = req.params;
    const updates = req.body;

    try {
        if (!isValidObjectId(subjectId)) {
            return res.status(400).json({ message: "Invalid subject ID format." });
        }

        const updatedSubject = await Subjects.findByIdAndUpdate(subjectId, updates, { new: true });
        if (!updatedSubject) return res.status(404).json({ message: "Subject not found" });

        res.status(200).json({ message: "Subject updated successfully", subject: updatedSubject });
    } catch (error) {
        console.error("Error updating subject:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a subject
export const deleteSubject = async (req, res) => {
    const { subjectId } = req.params;

    try {
        if (!isValidObjectId(subjectId)) {
            return res.status(400).json({ message: "Invalid subject ID format." });
        }

        const deletedSubject = await Subjects.findByIdAndDelete(subjectId);
        if (!deletedSubject) return res.status(404).json({ message: "Subject not found" });

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//
// STUDENT MARKS OPERATIONS
//

// Add marks for a student
export const addMarks = async (req, res) => {
    const { studentId, subjectId, marks } = req.body;

    try {
        const newMarks = new StudentMarks({ studentId, subjectId, marks });
        await newMarks.save();
        res.status(201).json({ message: "Marks added successfully", marks: newMarks });
    } catch (error) {
        console.error("Error adding marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get marks for a student
export const getMarksByStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        if (!isValidObjectId(studentId)) {
            return res.status(400).json({ message: "Invalid student ID format." });
        }

        const marks = await StudentMarks.find({ studentId }).populate("subjectId");
        res.status(200).json({ marks });
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update marks
export const updateMarks = async (req, res) => {
    const { marksId } = req.params;
    const updates = req.body;

    try {
        if (!isValidObjectId(marksId)) {
            return res.status(400).json({ message: "Invalid marks ID format." });
        }

        const updatedMarks = await StudentMarks.findByIdAndUpdate(marksId, updates, { new: true });
        if (!updatedMarks) return res.status(404).json({ message: "Marks not found" });

        res.status(200).json({ message: "Marks updated successfully", marks: updatedMarks });
    } catch (error) {
        console.error("Error updating marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete marks
export const deleteMarks = async (req, res) => {
    const { marksId } = req.params;

    try {
        if (!isValidObjectId(marksId)) {
            return res.status(400).json({ message: "Invalid marks ID format." });
        }

        const deletedMarks = await StudentMarks.findByIdAndDelete(marksId);
        if (!deletedMarks) return res.status(404).json({ message: "Marks not found" });

        res.status(200).json({ message: "Marks deleted successfully" });
    } catch (error) {
        console.error("Error deleting marks:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};