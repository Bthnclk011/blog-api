const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema(
    {
        title: {type: String, required: true,  unique: true, minLength: 1, maxLength: 20},
        posts: [{type: Schema.ObjectId, ref:'Post'}]
    }
)

CategoriesSchema.virtual('url').get(function () 
{
    return `categories/${this.title}`
})

module.exports = mongoose.model('Category', CategoriesSchema);