const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const generateToken = require('../config/generateToken.js')

const registerUser = asyncHandler(async(req,res) => {
    const {name,email,password,profilePic} = req.body;   

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Enter All The Fields")
    } 

    const userExists = await User.findOne({ email });

    if(userExists){
        res.status(400);
        throw new Error("Please Enter All The Fields");
    }

    const user = await User.create({
        name,
        email,
        password,
        profilePic,
    })
    
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400);
        throw new Error("Failed to Register the User");
    }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//Searching Using Queries
const allUsers = asyncHandler(async(req,res)=>{

  const keyword = req.query.search
  ?{
    $or: [ //or function to find query either by email or name
      {name:{$regex: req.query.search, $options:"i"}} ,    //$regex --> compares two string
      {email:{$regex: req.query.search, $options:"i"}} ,   // i : insensitive to Uppercase or lowerCase Search
    ]
  }
  : {};

  const users = await User.find(keyword).find({_id: { $ne:req.user._id}});  //find every user according to search query except our id
  res.send(users);
})

module.exports = { registerUser,authUser,allUsers }
