const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        email: {type: String},
        userId: {type: String, required: true},
        posterName: {type: String, required: true},
    },
    {
        timestamps: true
    }
);

const Post = model('Posts', postSchema);

module.exports = Post;