import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subject_name: {
        type: String,
        required: true,
        trim: true,
    },
    branch: {
        type: String,
        required: true,
        trim: true,
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8,
    },
    subject_code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// Virtual field to populate marks for a subject
subjectSchema.virtual("marks", {
    ref: "StudentMarks", // Reference to StudentMarks model
    localField: "_id", // Field in Subjects
    foreignField: "subjectId", // Field in StudentMarks
});

subjectSchema.set("toJSON", { virtuals: true });
subjectSchema.set("toObject", { virtuals: true });

export const Subjects = mongoose.model("Subjects", subjectSchema);