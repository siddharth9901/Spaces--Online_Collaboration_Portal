const https = require('https');
const http = require("http");
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
var app = express();
const cors = require('cors');



// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// };



//const session=require('express-session');
dotenv.config({ path: './config.env' });

require('./db/conn');

// const videoCall = require("./routes/videoIndex");

app.use(cors())
app.use(express.json());



const PORT = process.env.PORT;

//link router file to make the link
app.use(require('./routes/auth'));


//Middleware

// const middleware = (req,res,next) => {
//     console.log('Hi Middleware'); 
//     next();
// }


// app.get('/',(req,res)=>{
//     res.send('Hello from the other side');
// });

app.get('/login', (req, res) => {
    res.send('Hello from the login');
});

// app.get('/newproject',(req,res)=>{
//     console.log('hi new proj');
//     res.send('Hello from the newproject');
// });

var server = http.createServer(app)
var io = require('socket.io')(server, {
    cors: {
        origin: ["https://vasu-mandhanya.github.io:*", "https://siddharth9901.github.io:*"],
        methods: ["GET", "POST"]
    }
});
server.listen(PORT, () => {
    console.log(`running server at ${PORT}`);
});
console.log(server);

//JWT CODE------------------------------------------------------------------------------------------

const jwt = require('jsonwebtoken');

function VerifyToken(token) {
    try {
        var decoded = jwt.verify(token, "Testing12345")
        console.log(decoded)
        return decoded
    }
    catch (err) {
        console.log("Error!!!", err);
    }
}

let users = [];
const RoomUsers = {};

const socketToRoom = {};

const addUser = (userEmail, socketId) => {
    !users.some((user) => user.userEmail === userEmail) &&
        users.push({ userEmail, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userEmail) => {
    console.log(userEmail);
    console.log(users)
    console.log("Found: ", users.find((user) => user.userEmail === userEmail))
    return users.find((user) => user.userEmail === userEmail);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected: ", socket.id);
    io.emit("Welcome", "hello this is SOCKET SERVER!") //.emit("EVENT NAME","MESSAGE")
    //take userId and socketId from user
    socket.on("addUser", (token) => {
        try {
            const dToken = VerifyToken(token);
            const userId = dToken.username;
            addUser(userId, socket.id);
            io.emit("getUsers", users)
        } catch (err) {
            console.log(err);
        }
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log(text)
        if (receiverId === "Group") {
            var type = "Group";
            io.emit("getMessage", {
                senderId,
                text,
                type
            });
        }
        else {
            console.log(receiverId)
            const user = getUser(receiverId);
            console.log(user)
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    text,
                });
            }
        }
    });


    //send and get message
    socket.on("Call", ({ senderId, receiverId, type }) => {
        console.log(type)
        console.log(receiverId)
        const user = getUser(receiverId);
        console.log(user)
        if (user) {
            io.to(user.socketId).emit("getCall", type, senderId, socket.id
            );
        }
    }
    );

    socket.on("Accept Call", ({ receiverId }) => {
        console.log("Check:", receiverId)
        const user = getUser(receiverId);
        console.log(user)
        if (user) {
            io.to(user.socketId).emit("Call Accepted");
        }
    }
    );

    socket.on("Reject Call", ({ receiverId }) => {
        console.log("Check:", receiverId)
        const user = getUser(receiverId);
        console.log("Rejected Call")
        console.log(user)
        if (user) {
            io.to(user.socketId).emit("Call Rejected");
        }
    }
    );

    //when disconnect and room leaving
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
        try {
            const roomID = socketToRoom[socket.id];
            let room = RoomUsers[roomID];
            if (room) {
                room = room.filter(id => id.socket !== socket.id);
                RoomUsers[roomID] = room;
                const newUsers = RoomUsers[roomID].filter(id => id.socket !== socket.id);
                console.log("Someone Disconnected Users Array", newUsers);
                socket.emit("all users", newUsers);
            }
            //socket.emit("all users after someone left", room);
            console.log("Someone Disconnected", socket.id);
            io.emit("user Left", { callerID: socket.id });
        } catch (err) {
            console.log(err)
        }
    });

    // ROOMS MAIN CODE:-----------------------------------

    //console.log("Someone Connected", socket.id);
    socket.on("join room", data => {
        console.log("Join DATA: ", data, socket.id)
        try {
            if (VerifyToken(data.token)) {
                if (RoomUsers[data.roomID]) {
                    const length = RoomUsers[data.roomID].length;
                    if (length === 4) {
                        socket.emit("room full");
                        return;
                    }
                    RoomUsers[data.roomID].push({ socket: socket.id, name: data.name });
                } else {
                    RoomUsers[data.roomID] = [{ socket: socket.id, name: data.name }];
                }
                socketToRoom[socket.id] = data.roomID;
                const usersInThisRoom = RoomUsers[data.roomID].filter(id => id.socket !== socket.id);
                console.log("all users Array", usersInThisRoom);
                socket.emit("all users", usersInThisRoom);
            }
        } catch (err) {
            console.log(err)
        }
    });

    socket.on("sending signal", payload => {
        //console.log("Payload sent: ", payload)
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, name: payload.paramsName });
    });

    socket.on("returning signal", payload => {
        //console.log("returning payload:", payload)
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('Camera off', () => {
        console.log("Check3: ", socket.id)
        const roomID = socketToRoom[socket.id];
        console.log(socketToRoom)
        console.log(roomID)
        let room = RoomUsers[roomID]?.map(id => id.socket)
        console.log("Camera Off Room: ", room)
        if (room) {
            console.log("Camera Off Room: ", room)
            room = room.filter(id => id !== socket.id);
            io.emit("Camera off", socket.id, room);
        }
        //socket.emit("all users after someone left", room);
        // console.log("Someone Disconnected", socket.id);
        // io.emit("user Left",{callerID: socket.id});
    });

    socket.on('Mute', () => {
        console.log("Check1: ", socket.id)
        const roomID = socketToRoom[socket.id];
        let room = RoomUsers[roomID]?.map(id => id.socket)
        if (room) {
            console.log(room)
            room = room.filter(id => id !== socket.id);
            io.emit("Mute", socket.id, room);
        }
        //socket.emit("all users after someone left", room);
        // console.log("Someone Disconnected", socket.id);
        // io.emit("user Left",{callerID: socket.id});
    });

    socket.on('Unmute', () => {
        console.log("Check2: ", socket.id)
        const roomID = socketToRoom[socket.id];
        let room = RoomUsers[roomID]?.map(id => id.socket)
        if (room) {
            console.log(room)
            room = room.filter(id => id !== socket.id);
            io.emit("Unmute", socket.id, room);
        }
        //socket.emit("all users after someone left", room);
        // console.log("Someone Disconnected", socket.id);
        // io.emit("user Left",{callerID: socket.id});
    });
    socket.on('disconnectNow', () => {
        const roomID = socketToRoom[socket.id];
        let room = RoomUsers[roomID];
        if (room) {
            room = room.filter(id => id.socket !== socket.id);
            RoomUsers[roomID] = room;
            const newUsers = RoomUsers[roomID].filter(id => id.socket !== socket.id);
            console.log("Someone Disconnected Users Array", newUsers);
            //socket.emit("all users",newUsers);
        }
        //socket.emit("all users after someone left", room);
        console.log("Someone Disconnected Now", socket.id);
        io.emit("user Left", { callerID: socket.id });
    });





});