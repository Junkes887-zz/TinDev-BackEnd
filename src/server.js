const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectUsers = {

};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    connectUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://junkes:junkes@cluster0-kcvmi.mongodb.net/tindev?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectUsers = connectUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

server.listen(3333);