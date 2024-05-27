const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const CommentsSchema = new Schema(
    {
       comment: {type: String, minLength: 1, required: true},
       date: 
       {
           type: Date,
           required: true,
           get: (val) => moment(val).format('DD-MM-YYYY'),
           set:(val) => moment(val, 'DD-MM-YYYY').toDate()
       },
       author: {type: String, default:'Guest'}
    }
)

CommentsSchema.virtual('url').get(function()
{
    return `/comments/${this.id}`
})

module.exports = mongoose.model('Comment', CommentsSchema);