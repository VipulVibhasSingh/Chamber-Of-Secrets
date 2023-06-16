const mongoose = require('mongoose');

const messageModel = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chats"
    },
},{
    timestamps:true  //Giving timestamps to it as well.
})

const Message = mongoose.model("Message",messageModel);
module.exports = Message
