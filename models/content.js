const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const keySchema = new Schema({
    userKey: {type: String, required: true},
    chatID: { type: Schema.Types.ObjectId, ref: 'Chat' },
    name: {type: String, required: true},
    lastMessage: {type: Schema.Types.ObjectId, required: false},
    color: {type: String, required: false},
    deleted: {type: Boolean, required: false, default: false}
    },
    {versionKey: false}
);

const messageSchema = new Schema({
    ownerID: { type: Schema.Types.ObjectId, ref: 'Key' },
    chatID: { type: Schema.Types.ObjectId, ref: 'Chat' },
    text: {type: String, required: true},
    time: {type: String, required: true}
    },
    {versionKey: false}
);

const chatSchema = new Schema({
    ownerID: { type: Schema.Types.ObjectId, ref: 'Key' },
    lastMessage: { type: Schema.Types.ObjectId, required: false}
    },
    {versionKey: false}
);

const encryptSchema = new Schema({
    chatID: { type: Schema.Types.ObjectId },
    encription: { type: String, required: true}
    },
    {versionKey: false}
);

module.exports.Key = mongoose.model("Key", keySchema);
module.exports.Message = mongoose.model("Message", messageSchema);
module.exports.Chat = mongoose.model("Chat", chatSchema);
module.exports.Encript = mongoose.model("Encript", encryptSchema);