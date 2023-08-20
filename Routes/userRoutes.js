const express = require('express');
const { registerUser,authUser,allUsers} = require("../Controller/userControllers");
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();

router.route("/").post(registerUser).get(protect,allUsers) //This is the benefit of writing in this style
// router.route("/login").post(authUser)
router.post("/login",authUser)
// router.route('/').get(allUsers); Now you can write this code on the registerUser post request


module.exports = router;