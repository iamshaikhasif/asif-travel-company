const { response } = require("../helper/utils");
const Student = require("../model/student_model");
const ObjectId = require('mongoose').Types.ObjectId;


const mapReqToModel = (req) => {
    return {
        firstName: req.firstName,
        lastName: req.lastName,
        gender: req.gender,
        dob: req.dob,
        email: req.email,
        pincode: req.pincode,
        address: req.address,
        state: req.state,
        city: req.city,
        phone: req.phone,
        category: req.category,
        nameOfSchool: req.nameOfSchool,
        currentClass: req.currentClass,
        department: req.department,
        language: req.language,
    }

}


const register = async (req, res) => {
    const studentData = mapReqToModel(req.body);
    try {
        student = await new Student({ ...studentData, userID: ObjectId(req.user.id), examLink: "text" }).save();
        return response(res, 200, 1, "Student Successfully Registered.", { student });
    } catch (e) {
        return response(res, 500, 0, "Student Not Registered", e);
    }
}


const getStudentList = async (req, res) => {

    try {
        const studentList = await Student.find({ userID: ObjectId(req.user.id) });
        return response(res, 200, 1, "Student Successfully Registered.", { studentList });
    } catch (e) {
        return response(res, 500, 0, "Student Not Registered", e);
    }

}

module.exports = { register, getStudentList }
