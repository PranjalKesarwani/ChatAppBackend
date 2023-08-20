const asyncHandler = require('express-async-handler');
const Message = require('../Models/messageModel');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModels');


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {

        let message = await Message.create(newMessage); //After creation of message {sender,content,chat,_id}


        message = await message.populate("sender", "name pic"); //{sender:{name,pic},content,chat,_id}


        message = await message.populate("chat");//{sender:{name,pic},content,chat:{_id,chatName,isGroupChat,users,groupAdmin},_id}


        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });  //{sender:{name,pic},content,chat:{_id,chatName,isGroupChat,users:{name,pic, email},groupAdmin},_id}   users ka name pic and email important hai taki chat me display kr sake bhaiya


        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message       
        });  //Here latest message field will be updated and previous message database me present rehega




        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


module.exports = { sendMessage, allMessages };