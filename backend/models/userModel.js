const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        trim:true
    },
    profilePic:{
        type:String,
        default:"https://www.nicepng.com/png/detail/955-9550929_zipxgamertv-anonymous-gaming.png"  //https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg
    },
},{
    timestamps:true
});

userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
};

userModel.pre("save",async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

const User = mongoose.model("User",userModel);
module.exports = User
