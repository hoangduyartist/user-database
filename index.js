const express = require('express');
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
//logger
const morgan = require("morgan");
const winston = require("./configs/winston");
var createError = require('http-errors');
//
const mongoose = require("mongoose");

const webAPI = require("./routers/webAPI");
const config = require("./configs/config");

//app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'application/octet-stream' }));
app.use(express.static("public")); //auto access /public in client
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json()); //using bodypaser as middleWave
app.use(bodyParser.urlencoded({ extended: false }));
//logger
app.use(morgan('combined', { stream: winston.stream }));
//

app.use('/web-api', webAPI);

app.get('/', async (req, res) => {
    // let checknum = (num)=>{
    //     return num>3;
    // }
    // if(!checknum(3)){
    //     console.log("hi")
    // }

    const requestItem = require('./models/requestItem');
    const reqItem = await requestItem.find({});

    if (reqItem) {
        return res.render("index.ejs", { reqItem });
    }
    return res.status(404).send("Resources are Empty");
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
    // next(new Error(err.message))
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
    // render the error page
    res.status(err.status || 500).send({err});
    // res.render('error');
  });

const PORT = config.PORT;
server.listen(PORT, () => {
    console.log("server listen on port " + PORT + " with host " + config.HOST);
});

// let urlMongo = "mongodb://localhost:27017/node_chat";
let urlMongo = process.env.MONGODB_URI || "mongodb+srv://hoangduy:hoangduy@cluster0-a0ada.mongodb.net/trainingDB?retryWrites=true";
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect(urlMongo, { useNewUrlParser: true }).then(
    (rs) => {
        console.log('connect DataBase MongGo OK');
    }
)
    .catch(connectError => connectError);

