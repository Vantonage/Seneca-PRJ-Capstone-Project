const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
    {
        comment: {type: String, required: true},
        postId: {type: String, required: true},
        name: {type: String, required: true},
    },
    {
        timestamps: true
    }
);

const Comment = model('Comments', commentSchema);

module.exports = Comment;