const express = require('express');
require('dotenv').config();
const Cors = require('cors');
const courseRoute = require('./routes/courseRouter');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const route = require('./routes/authRoute');
const router = require('./routes/teamRoute');
const info = require('./utils/sendMail');
const App = express();
const server = http.createServer(App);
const io = socketIo(server);
App.set('io', io);
App.use(express.json());
App.use(Cors({ origin: true, credentials: true }));
App.use('/auth', route);
App.use('/task', courseRoute);
App.use('/team', router);
App.get("/", (req, res) => {
    res.send("Server Started");
});

mongoose.connect(process.env.MONGOS_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        io.on('connection', (socket) => {
            console.log('User connected');
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
            // Set the socket in the app for later use
            App.set('socket', socket);
        });
        App.listen(process.env.PORT, () => {
            console.log(`Database is Connected and Server Start http://localhost:${process.env.PORT}`);
        })
    })
    .catch(err => {
        console.log(err)
    })
