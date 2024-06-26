const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const PostsSchema = new Schema(
    {
        title: {type: String, minLength: 1, required: true, unique: true},
        description: {type:String, minLength:1, required: true, unique: true},
        text: {type: String, minLength: 1, requried: true, unique: true},
        date: 
        {
            type: Date,
            required: true,
            get: (val) => moment(val).format('DD-MM-YYYY'),
            set:(val) => moment(val, 'DD-MM-YYYY').toDate()
        },
        published: {type: Boolean, default: true},
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category'},
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    }
)

PostsSchema.virtual('url').get(function()
{
    return `/posts/${this.title}`
});

module.exports = mongoose.model('Post', PostsSchema)