const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
    userKey: {type: String, required: true},
    chatID: {type: String, required: true},
    name: {type: String, required: true}
    },
    {versionKey: false}
);

const messageSchema = new Schema({
    ownerID: {type: String, required: true},
    text: {type: String, required: true},
    time: {type: String, required: true}
    },
    {versionKey: false}
);

const chatSchema = new Schema({
    ownerID: {type: String, required: true}
    },
    {versionKey: false}
);

module.exports.Key = mongoose.model("Key", keySchema);
module.exports.Message = mongoose.model("Message", messageSchema);
module.exports.Chat = mongoose.model("Chat", chatSchema);