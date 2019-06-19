const express = require("express");
const expressHbs = require("express-handlebars");
const mongoose = require("mongoose");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Content = require("./models/content");
const uuid4 = require("uuid/v4");
const archiver = require("archiver");
const fs = require("fs");
var Minizip = require('minizip-asm.js');
const CryptoJS = require("crypto-js");
const colors = require("./views/js/colors");

archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));

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



app.post("/logIn", function(req, res) {
    Content.Key.findOne({_id: req.body.id, deleted: false}, function(err, result) {
      if(result) {
        res.send(result.chatID);
      } else {
        res.send(false);
      }
    })
  })
  
  app.post("/keyCheck", function(req, res) {
    Content.Key.countDocuments({userKey: req.body.key, deleted: false}, function(err, result) {
      if (result) {
        Content.Key.findOne({userKey: req.body.key}, function(err, key) {
          res.send({
            pass: true,
            message: key.lastMessage
          });
        })
      } else {
        res.send({
          pass: false
        });
      }
    })
  })

  app.post("/isOwner", function(req, res) {
    Content.Key.findOne({userKey: req.body.key}, function(err, user) {
      if (err) {
        console.log(err);
      } else if (user != null) {
        Content.Chat.findOne({ownerID: user._id}, function(err, chat) {
          if (err) {
            console.log(err);
          } else if (chat != null) {
            res.send(true);
          } else {
            res.send(false);
          }
        })
      } else {
        res.send(false);
      }
    })
  })

  app.post("/getTrigger", function(req, res) {
    Content.Key.findById(req.body.id, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        Content.Chat.findById(result.chatID, function(err, chat) {
          if (err) {
            console.log(err);
          } else {
            Content.Key.updateOne({_id: result._id}, {"lastMessage": chat.lastMessage}, function(err, key) {
              if (err) {
                console.log(err);
              }
            });
          }
        })
        res.send({
          id: result.lastMessage
        })
      }

      
    })
    
  })



  app.post("/updateTrigger", function(req, res) {
    Content.Key.updateOne({_id: req.body.id}, {"lastMessage": req.body.message}, function(err, keys) {
      if(err) {
        console.log(err);
      }
    })
    res.set("Connection", "close");
    res.end();
  })

app.post("/createChat", function(req, res) {
    var key = uuid4().substr(0, 8);
    const owner = new Content.Key({_id: new mongoose.Types.ObjectId(), userKey: key, chatID: "none", name: req.body.name, color: colors[0]});
    const chat = new Content.Chat({_id: new mongoose.Types.ObjectId(), ownerID: owner._id});
    const encript = new Content.Encript({chatID: chat._id, encription: uuid4()});
    owner.chatID = chat._id;
    owner.save();
    chat.save();
    encript.save();
    res.send(key);

    fs.writeFile("data/" + encript.encription + ".txt",
    CryptoJS.AES.encrypt(uuid4(), uuid4()).toString(),
    function(err) {
      if (err) {
        console.log(err);
      }
    });
});

app.post("/createKey", function(req, res) {
    console.log(req.body);
    Content.Chat.findOne({ownerID: req.body.id}, function(err, doc) {
        //console.log(doc);
        Content.Key.findOne({name: req.body.name, chatID: doc._id, deleted: false}, function(err, user) {
          if (err) {
            console.log(err);
          } else if (user == null) {
            Content.Key.countDocuments({chatID: doc._id}, function(err, count) {
              var key = uuid4().substr(0, 8);
              const newKey = new Content.Key({userKey: key, name: req.body.name, chatID: doc._id, color: colors[count]});
              newKey.save()
              .then(function(doc) {
                  res.send({
                    check: true,
                    key: doc.userKey
                  });
              })
            })
          } else {
            res.send({
              check: false
            })
          }
        })
        
    })
})

app.post("/remind", function(req, res) {
  Content.Key.findById(req.body.id, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result.userKey);
    }
  })
})

app.post("/remindByName", function(req, res) {
  Content.Key.findById(req.body.id, function(err, key) {
    if (err) {
      console.log(err);
    } else {
      res.send(key.userKey);
    }
  })
})

app.post("/exit", function(req, res) {
    res.render("partials/main.hbs");
})

app.get(/.*/, function(req, res) {
    res.render("partials/main.hbs");
});

module.exports = app;