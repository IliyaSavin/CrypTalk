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


app.post("/enterChat", function(req, res) {
    Content.Key.findOne({userKey: req.body.key}, function(err, result) {
        if(err){
            console.log(err);
        } else if (result != null) {
            res.render("partials/chat.hbs", {
                id: result._id,
                isOwner: false,
                messages: [{name: "1", time: "1:10", message: "Hello"}, {name: "2", time: "2:20", message: "Hello"}]
            });
        }
    })
  });


app.post("/createChat", function(req, res) {
    var key = uuid4().substr(0, 8);
    const owner = new Content.Key({userKey: key, chatID: "none", name: "admin"});
    const chat = new Content.Chat({ownerID: owner._id});
    owner.chatID = chat._id;
    owner.save();
    chat.save();

    res.render("partials/chat.hbs", {
        isOwner: true,
        firstVisit: true,
        key: key,
        id: owner._id
    });
});

app.post("/createKey", function(req, res) {
    //console.log(req.body);


    Content.Chat.findOne({ownerID: req.body.id}, function(err, doc) {
        console.log(doc);
        var key = uuid4().substr(0, 8);
        const newKey = new Content.Key({userKey: key, chatID: doc._id, name: req.body.name});
        newKey.save()
            .then(function(doc) {
                res.send(doc.userKey);
            })
    })
})

app.post("/exit", function(req, res) {
    res.render("partials/main.hbs");
})

app.get("/", function(req, res) {
    res.render("partials/main.hbs");
});

module.exports = app;