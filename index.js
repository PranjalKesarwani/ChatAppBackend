const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
dotenv.config()
require("./Config/db");
const PORT = process.env.PORT || 8000;
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes');
const path = require('path');
var cors = require('cors');

const app = express();
const origin = 'http://127.0.0.1:5173'
// const origin = 'https://sayhiii.netlify.app'

app.use(cors({
    origin: origin, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);



app.get("/",(req,res)=>{
    res.send('Api running successfully');
})



app.use(notFound);
app.use(errorHandler);


const server = app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`.yellow.bold);
})

//Socket server setup: we are adding a socket server layer over original server
const io = require('socket.io')(server, {
    pingTimeout: 60000,   //This means socket connection will wait for 60seconds before it shuts the connection as connection will waste the bandwith, suppose after last message user didn't send the message then after one minute connection will be closed
    cors: {
        origin: origin
    }
});

//After creation of io socket server, now we will establish a connection

io.on("connection", (socket) => {
    console.log('connected to socket.io');
    socket.on('setup', (userData) => {   //It will take the userId and connect it to the socket and will create the room for this user
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');

    }); //Here we creating the room of the individual user

    socket.on('join chat', (room) => {  //when another user will join it will be connected to the room and get joint
        socket.join(room);
        console.log("User Joined Room: " + room);
    }); //Here we created the room for the chatId and then joined the user's room from this room

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));


    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat;

        if (!chat.users) {
            return console.log('chat.users not defined');
        }

        chat.users.forEach(user => {          //if you are chatting in a group and you want to send the message to everyone except yourself
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived); //in means inside that users room, emit/send messagae
        })
    });
    socket.off("setup",()=>{
        console.log("USER DISCONNECTED!");
        socket.leave(userData._id);
    })
})


