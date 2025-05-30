const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
// app.use(cors({
//     origin: '*',
//     credentials: true,
// }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin:'*',
       
        methods: ["GET","POST"],
        credentials: true,
    }
});

io.on("connection", (socket) => {
    // User joins a room
    socket.on('join', ({ roomIDURL, usernameapi }) => {
        socket.join(roomIDURL);
        socket.data.roomIDURL = roomIDURL;
        socket.data.usernameapi = usernameapi;
        
        socket.to(roomIDURL).emit('joined-room', { usernameapi });
    });

    // Playback events
    socket.on('play', ({ roomIDURL }) => {
        socket.to(roomIDURL).emit('play');
    });

    socket.on('pause', ({ roomIDURL }) => {
        socket.to(roomIDURL).emit('pause');
    });

    socket.on('reset', ({ roomIDURL }) => {
        socket.to(roomIDURL).emit('reset');
    });

    socket.on('forward', ({ roomIDURL, ct }) => {
        socket.to(roomIDURL).emit('forward', { ct });
    });

    socket.on('backward', ({ roomIDURL,ct }) => {
        socket.to(roomIDURL).emit('backward',{ct});
    });

    // Logout event
    socket.on('logout', () => {
        const { roomIDURL, usernameapi } = socket.data;
        if (roomIDURL && usernameapi) {
            socket.to(roomIDURL).emit('left', { usernameapi });
            socket.leave(roomIDURL);
        }
        socket.disconnect();
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        // const { roomIDURL, usernameapi } = socket.data;
        // if (roomIDURL && usernameapi) {
        //     socket.to(roomIDURL).emit('left', { usernameapi });
        // }
        
    });
});

httpServer.listen(process.env.PORT, () => {
    console.log("Socket Server running at " + process.env.PORT);
});