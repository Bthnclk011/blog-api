const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const Categories = require('../models/Categories');
const Posts = require('../models/Posts');
const axios = require('axios');

exports.get_categories = asyncHandler(async(req, res, next) =>
{
    try
    {
        const categories = await Categories.find().exec();
        return res.json(categories)
    }
    
    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})

exports.post_categories = 
[
    body('title')
    .trim()
    .isString()
    .isLength({min:1})
    .escape()
    .withMessage('Category title should be string')
    ,
    asyncHandler(async(req, res, next) =>
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()})
        }

        try
        {
            const category = new Categories(
                {
                    title: req.body.title,
                    posts: [],
                })

            await category.save();
            return res.status(201).json({message: 'Category is created successfully'});
        }

        catch(err)
        {
            return res.status(500).json({message: err.message});
        }
    })
]

exports.put_categories = 
[
    body('title')
    .optional({checkFalsy: true})
    .trim()
    .isString()
    .isLength({min: 1})
    .escape()
    .withMessage('Category title should be string')
    ,
   
    asyncHandler(async(req, res, next) =>
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()})
        }

        try
        {
            const category = await Categories.findById(req.params.categoryId).exec();

            if(!category)
            {
                return res.status(404).json({message: 'Category not found'});
            }

            if(req.body.title)
            {
                category.title = req.body.title;
                await category.save();
            }

            return res.status(200).json({message: 'Category updated successfully'});
        }

        catch(err)
        {
            return res.status(500).json({message: err.message});
        }
    })
]

exports.delete_categories = asyncHandler(async(req, res, next) => 
{
    try
    {
        const category = await Categories.findById(req.params.categoryId);
        if(!category)
        {
            return res.status(404).json({message: 'Category not found'})
        }

        let defaultCategory = await Categories.findOne({title: 'default'}).exec();
        if(!defaultCategory)
        {
            const createCategoryResponse = await axios.post('http://localhost:3000/categories',
                {
                    title: 'default'
                })

            if(!createCategoryResponse !== 201)
            {
                return res.status(500).json({message: 'Category not created successfully'})
            }

            defaultCategory = await Categories.find({title: 'default'});
        }

        const posts = await Posts.find({category: req.params.categoryId}).exec();

        for(let post of posts)
        {
            const updatePostResponse = await axios.put(`http://localhost:3000/posts/${post.id}`, 
                {
                    category: defaultCategory.id
                })

            if(!updatePostResponse)
            {
                return res.status(500).json({message: 'Posts not updated successfully'})
            }
        }

        await Categories.findByIdAndDelete(req.params.categoryId).exec();

        return res.status(200).json({message: 'Category successfully deleted'})

    }

    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})