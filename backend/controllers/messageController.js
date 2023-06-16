const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const Chats = require('../models/chatModel.js')
const Message = require('../models/messageModel.js')

const sendMessage = asyncHandler(async(req,res)=>{
    const {content,chatID} = req.body;

    if(!content || !chatID){
        console.log("Invalid data passed into request");
        return res.status(400);
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatID
    }

    try {
        var message = await Message.create(newMessage);
        
        message = await message.populate({
            path:"sender",
            select:"name profilePic"
        }),
        message = await message.populate({
            path:"chat",
            select:"chatName isGroupChat users latestMessage groupAdmin"
        })
        message = await User.populate(message,{
            path:"chat.users",
            select:"name profilePic email"
        })

        await Chats.findByIdAndUpdate(req.body.chatID,{
            latestMessage:message,
        })

        res.json(message)
    } catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
});

const allMessage = asyncHandler(async(req,res)=>{
    try {
        const allMessages = await Message.find({chat:req.params.chatID})
        .populate("sender","name profilePic email")
        .populate("chat");

        res.json(allMessages)
    } catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
})

module.exports = { sendMessage,allMessage }
