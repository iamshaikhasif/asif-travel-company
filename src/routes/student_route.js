var express = require('express')
var router = express.Router();
const Student = require("../controller/student_controller");
const Authorize = require("../midelware/verify_token");

router.post("/register", Authorize, Student.register);
router.get("/studentList", Authorize, Student.getStudentList);





module.exports = router;