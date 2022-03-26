var express = require('express')
var router = express.Router();
const User = require("../controller/user_controller");

router.post("/signup", User.signUp);

router.post("/login", User.login);




module.exports = router;