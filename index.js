const express = require('express');
const app = express();
const server = require("http").Server(app);

const mongoose = require("mongoose");

let PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log("serverlisten on port "+PORT);
});

// let urlMongo = "mongodb://localhost:27017/node_chat";
let urlMongo = process.env.MONGODB_URI || "mongodb+srv://hoangduy:hoangduy@cluster0-a0ada.mongodb.net/trainingDB?retryWrites=true";
mongoose.Promise = global.Promise;
mongoose.connect(urlMongo, { useNewUrlParser: true }).then(
    (rs) => {
        console.log('connect DataBase MongGo OK');
    }
)
    .catch(connectError => connectError);