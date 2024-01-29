const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
    {
        message: {type: String, required: true},
        receiverId: {type: String, required: true},
        senderId: {type: String, required: true},
        name: {type: String, required: true},
    },
    {
        timestamps: true
    }
);

const Message = model('Messages', messageSchema);

module.exports = Message;