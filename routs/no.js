const express = require('express');
const CryptoJS = require("crypto-js");
const router = express.Router();
const Content = require('../models/content');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
//const jsonParser = express.json();
//const bodyParser = require("body-parser");

//var jsonParser = bodyParser.json();

// router.get("/api/main",jsonParser, function(req, res) {
//     const id = req.body._id;
//     res.render("partials/main.hbs",);
// })

// router.post("/api/new", jsonParser, function(req, res) {
//     if(!req.body) return res.sendStatus(400);

//     const userName = req.body.name;
//     const userEmail = req.body.email;
//     const userPassword = req.body.password;
//     const user = new Content.User({name: userName, email: userEmail, password: userPassword});

//     Content.User.findOne({email: userEmail}, function(err, result) {
//         if(err) return console.log(err);
//         if(result != null) {
//             res.send(null);
//         } else {
//             user.save(function(err) {
//                 if(err) return console.log(err);
//                 res.send(user);
//             });
//         }
//     })
// });

// router.post("/api/user", jsonParser, function(req, res) {
//     const userEmail = req.body.email;
//     const userPassword = req.body.password;
//     Content.User.findOne({email: userEmail, password: userPassword}, function(err, user) {
//         if(err) return console.log(err);
//         if(user != null) {
//             res.send(user);
//         } else {
//             res.sendStatus(404);
//         }
//     })
// })



/*router.post("/api/enter", function(req, res) {
    const userKey = req.body.key;
    Content.Key.findOne({key: userKey}, function(err, user) {
        if(err) {return console.log(err);}
        else if(user != null) {
            Content.Chat.findOne({ownerKey: userKey}, function(err, chat) {
                if(err) {return console.log(err);}
                else if(chat != null) {
                    res.render("partials/chat.hbs", {
                        isOwner: true
                    });
                } else {
                    res.render("partials/chat.hbs", {
                        isOwner: false
                    });
                }
            })
            
        }
    })
});*/

router.post("/createChat", function(req, res) {
    res.render("partials/chat.hbs", {
        isOwner: true
    });
});



router.post("/enterChat", function(req, res) {
    res.render("partials/chat.hbs", {
        isOwner: true
    });
});

router.get("/", function(req, res) {
    res.render("partials/main.hbs");
});



module.exports = router;