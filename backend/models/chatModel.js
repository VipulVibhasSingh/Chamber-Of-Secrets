//chatName
//isGroupChat
//users[]
//latestMessage
//groupAdmin

const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
    chatName:{
        type:String , trim:true
    },
    isGroupChat:{
        type:Boolean , default:false
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,   //The ref option is what tells mongoose. js which model to use during population 
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true   //field so that everytime a new data is added, a time stamp is created by mongoose.
})

const Chats = mongoose.model("Chats",chatModel);
module.exports = Chats
