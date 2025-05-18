const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const cors =require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin:process.env.ORIGIN_URL,
    credentials:true,
}));


const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:process.env.ORIGIN_URL,
        methods:'*',
        credentials:true,
    }
})

io.on("connection",(socket)=>{
    // console.log('Client connected to backend');

    socket.on('join',({roomID,usernameapi})=>{
        socket.join(roomID);
        console.log(`${usernameapi} joined the room`);
    })


    socket.on('play',({roomID})=>{
        socket.to(roomID).emit('play');
    })

    socket.on('pause',({roomID})=>{
        socket.to(roomID).emit('pause');
    })
    
    
 
     socket.on('reset',({roomID})=>{
        socket.to(roomID).emit('reset');
    })

    socket.on('forward',({roomID,currentTime})=>{
        socket.to(roomID).emit('forward',{currentTime});
    })

    socket.on('backward',({roomID})=>{
        socket.to(roomID).emit('backward');
    })
});

httpServer.listen(process.env.PORT,()=>{
    console.log("Socket Server running at "+ process.env.PORT);
})