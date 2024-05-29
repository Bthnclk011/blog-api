const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const UsersSchema = new Schema(
    {
        name: {type: String, unique: true, required: true, minLength: 1, maxLength:50},
        regDate: 
        {
            type:Date,
            required: true,
            get: (val) => moment(val).format('DD-MM-YYYY'),
            set: (val) => moment(val, 'DD-MM-YYYY').toDate()
        },
        rank: {type: String, enum:['admin', 'editor', 'author', 'user'], required: true},
        age: {type: Number}, 
        gender: {type: String}
    }
)

UsersSchema.virtual('url').get(function () 
{
    return `/users/${this.name}`
});

module.exports = mongoose.model('User', UsersSchema)