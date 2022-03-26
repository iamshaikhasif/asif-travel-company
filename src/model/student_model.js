const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    phone: { type: String, required: true },
    category: { type: String, required: true, enum: ["SC", "JR", "SR"] },
    nameOfSchool: { type: String, required: true },
    currentClass: { type: String, required: true },
    department: { type: String },
    language: { type: String },
    userID:{ type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    examLink: { type: String, required: true, default: "TestExamLink" }
});

// export model user with StudentSchema
module.exports = mongoose.model("student", StudentSchema);