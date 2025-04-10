import express from 'express';
import {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent,
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject,
    addMarks,
    getMarksByStudent,
    updateMarks,
    deleteMarks
} from '../controllers/student.controller.js';

const router = express.Router();

//
// STUDENT ROUTES
//

// POST: Create a new student
router.post('/students', createStudent);

// GET: Get all students
router.get('/students', getAllStudents);

// PUT: Update a student by ID
router.put('/students/:studentId', updateStudent);

// DELETE: Delete a student by ID
router.delete('/students/:studentId', deleteStudent);

//
// SUBJECT ROUTES
//

// POST: Create a new subject
router.post('/subjects', createSubject);

// GET: Get all subjects
router.get('/subjects', getAllSubjects);

// PUT: Update a subject by ID
router.put('/subjects/:subjectId', updateSubject);

// DELETE: Delete a subject by ID
router.delete('/subjects/:subjectId', deleteSubject);

//
// MARKS ROUTES
//

// POST: Add marks for a student
router.post('/marks', addMarks);

// GET: Get marks for a specific student
router.get('/marks/:studentId', getMarksByStudent);

// PUT: Update marks by ID
router.put('/marks/:marksId', updateMarks);

// DELETE: Delete marks by ID
router.delete('/marks/:marksId', deleteMarks);

export default router;