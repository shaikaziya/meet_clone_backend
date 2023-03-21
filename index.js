const dotenv = require('dotenv')
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/config.js");
const userRoutes = require("./routes/usersRoute.js");
const meetingRoutes = require('./routes/meetingRoute.js');
const app = express();
const server = http.createServer(app);
const path = require('path');

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
})

dotenv.config();
connectDB();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("API for Meet Clone application running successfully");
})

app.use('/api/users', userRoutes);
app.use('/api/meeting', meetingRoutes);

io.on("connection", (socket) => {
    try {
        console.log("Connected from socket");
        socket.on("code", (data, callback) => {
            socket.broadcast.emit("code", data);
        });
    } catch (ex) {
        console.log(ex.message);
    }
});

const port = process.env.PORT || 4005;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

