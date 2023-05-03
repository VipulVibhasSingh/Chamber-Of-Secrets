const express = require('express');
const dotenv = require('dotenv');
const app = express();
const chats = require('./data/data.js');
const ConnectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const {notFound,errorHandler} = require('./middleware/errorMiddleware.js')

dotenv.config();
ConnectDB();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Server is Running"); 
})

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 2000  //if PORT(from .env) not availabe use 2000 as PORT

const server = app.listen(PORT, console.log("Server started on PORT " + PORT));

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin:"http://localhost:3000",
    }
})

io.on("connection",(socket)=>{
    console.log("Connect To Socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        //console.log(userData._id);
        socket.join(userData._id)
        socket.emit("connected")
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User joined " + room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))
    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("chat.users is not defined");

        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved",newMessageRecieved)
        });
    })
})

