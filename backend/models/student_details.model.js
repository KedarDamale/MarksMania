import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    student_reg: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    student_name: {
        type: String,
        required: true,
        trim: true,
    },
    student_branch: {
        type: String,
        required: true,
        trim: true,
    },
    student_graduation_year: {
        type: Number,
        required: true,
        min: 2024,
        max: new Date().getFullYear() + 10,
    },
    student_batch: {
        type: String,
        required: true,
        trim: true,
    },
    student_rollno: {
        type: Number,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

// Virtual field to populate marks for a student
studentSchema.virtual("marks", {
    ref: "StudentMarks", // Reference to StudentMarks model
    localField: "_id", // Field in StudentDetails
    foreignField: "studentId", // Field in StudentMarks
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

export const StudentDetails = mongoose.model("StudentDetails", studentSchema);
