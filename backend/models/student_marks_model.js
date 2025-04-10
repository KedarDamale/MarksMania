import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentDetails", // Reference to the StudentDetails model
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subjects", // Reference to the Subjects model
        required: true,
    },
    marks: [
        {
            examType: {
                type: String,
                enum: ["IA1", "IA2", "Semester"], // Types of exams
                required: true,
            },
            score: {
                type: Number,
                required: true,
                validate: {
                    validator: function (value) {
                        if (this.examType === "IA1" || this.examType === "IA2") {
                            return value >= 0 && value <= 20; // IA1 and IA2 max 20 marks
                        } else if (this.examType === "Semester") {
                            return value >= 0 && value <= 80; // Semester max 80 marks
                        }
                        return false; // Invalid examType
                    },
                    message: (props) =>
                        `${props.value} is invalid for ${props.instance.examType}. Max marks: IA1/IA2 = 20, Semester = 80.`,
                },
            },
            date: {
                type: Date,
                default: Date.now, // Date when the marks were recorded
            },
        },
    ],
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Add an index for faster queries on studentId and subjectId
marksSchema.index({ studentId: 1, subjectId: 1 });

export const StudentMarks = mongoose.model("StudentMarks", marksSchema);