const express = require('express');
const {protect} = require("../middleware/authMiddleware")
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require("../Controller/chatControllers")

const router = express.Router();

router.route("/").post(protect,accessChat);//This route is not working properly check this out with the help of postman and remember to send token of any user with it
router.route("/").get(protect,fetchChats); 
router.route("/group").post(protect,createGroupChat);
router.route("/rename").put(protect,renameGroup);
router.route("/groupAdd").put(protect,addToGroup);
router.route("/groupremove").put(protect,removeFromGroup);


module.exports = router;


