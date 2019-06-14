const express = require('express');
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const webAPI = require("./routers/webAPI");

app.use(bodyParser.json()); //using bodypaser as middleWave
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/web-api',webAPI);
app.get('/hello',(req,res)=>{
    res.send("hello");
})

let PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
    console.log("serverlisten on port "+PORT);
});

// let urlMongo = "mongodb://localhost:27017/node_chat";
let urlMongo = process.env.MONGODB_URI || "mongodb+srv://hoangduy:hoangduy@cluster0-a0ada.mongodb.net/trainingDB?retryWrites=true";
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(urlMongo, { useNewUrlParser: true }).then(
    (rs) => {
        console.log('connect DataBase MongGo OK');
    }
)
    .catch(connectError => connectError);

// let item = require('./models/item');
// app.post('/new', async (req,res)=>{
//     let newItem = new item({
//         _id: new mongoose.Types.ObjectId(),
//         fullname: req.body.fullname,
//         name: req.body.name,
//     })
//     let fullname = req.body.fullname;
//     console.log(fullname);
//     newItem1 = await newItem.save();
//     if(newItem1) {
//         return res.status(200).send(newItem1);
//         // return ({newItem: newItem1})
//     }
//     return res.status(500).send({msg:"error"});
// })