const express = require("express");
const expressHbs = require("express-handlebars");
const mongoose = require("mongoose");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Content = require("./models/content");
const uuid4 = require("uuid/v4");
//rsconst routs = require("./routs/index");

const app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
));

app.set("view engine", "hbs");

mongoose.connect("mongodb://localhost:27017/CrypTalk", {useNewUrlParser:true}, function(err) {
    if(err) return console.log(err);
});



app.use(cookieParser());
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + "/views"));

//app.use('/', routs);

app.post("/createChat", function(req, res) {
    var key = uuid4().substr(0, 8);
    const owner = new Content.Key({userKey: key, name: "admin"});
    owner.save()
        .then(function(doc){
            const chat = new Content.Chat({ownerID: doc._id});
            chat.save()
            console.log("Сохранен объект", doc);
        })
        .catch(function (err){
            console.log(err);
        });

    res.render("partials/chat.hbs", {
        isOwner: true,
        firstVisit: true,
        key: key
    });
});

app.post("/enterChat", function(req, res) {
    res.render("partials/chat.hbs", {
        isOwner: false,
        messages: [{name: "1", time: "1:10", message: "Hello"}, {name: "2", time: "2:20", message: "Hello"}]
    });
});

app.post("/exit", function(req, res) {
    res.render("partials/main.hbs");
})

app.get("/", function(req, res) {
    res.render("partials/main.hbs");
});



module.exports = app;