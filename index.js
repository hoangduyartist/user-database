const express = require('express');
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const webAPI = require("./routers/webAPI");

//app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'application/octet-stream' }));
app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json()); //using bodypaser as middleWave
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/web-api',webAPI);
app.get('/hello',(req,res)=>{
    res.send("hello");
})
app.get('/',async (req,res)=>{

    const requestItem = require('./models/requestItem');
    const reqItem = await requestItem.find({}); 

    if(reqItem){
        //console.log(reqItem);
        return res.render("index",{reqItem});
    }
    console.log("error");

})
// app.post('/postreq',async (req,res)=>{
//     const requestItem = require('./models/requestItem');
//     const reqItem = new requestItem({
//         _id: new mongoose.Types.ObjectId(),
//         name:"Login",
//         method: "Post",
//         endpoint:"login",
//         description:"des",
//         return: ["arr1", "arr2"]
//     })
//     let newreq = await reqItem.save();
//     if(newreq) return res.send(newreq)
// })

let PORT = process.env.PORT || 81;
server.listen(PORT, ()=>{
    console.log("server listen on port "+PORT);
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