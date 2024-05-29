const asyncHandler = require('express-async-handler');
const { body, validationResult} = require('express-validator');
const Posts = require('../models/Posts');
const Comments = require('../models/Comments');

exports.get_posts = asyncHandler(async(req, res, next) =>
{
    try
    {
        const posts = await Posts.find().exec();
        
        res.response(200).json(posts)
    }

    catch(err)
    {
        res.response(500).json({message: err.message})
    }
})

exports.post_posts = 
[   
    body('title')
    .trim()
    .isLength({min:1, max:30})
    .isString()
    .escape()
    .withMessage('Title must be a string, length of between min 1 and max 30')
    ,
    body('description')
    .trim()
    .isLength({min:1, max:100})
    .isString()
    .escape()
    .withMessage('Title must be a string, length of between min 1 and max 100')
    ,
    body('text')
    .trim()
    .isLength({min:1})
    .isString()
    .escape()
    .withMessage('Title must be a string')
    ,
    body('published')
    .optional({checkFalsy: true})
    .trim()
    .isBoolean()
    .escape()
    .withMessage('Published must be one of these: true, false')
    ,
    asyncHandler(async(req, res, next) =>
    {
        const errors = validationResolt(req);
        if(!errors.isEmpty())
        {
            res.status(400).json({errors: errors.array()})
        }

        try
        {
            const post = new Posts(
                {
                    title: req.body.title,
                    description: req.body.description,
                    text: req.body.text,
                    date: new Date(),
                    published: req.body.published,
                    author: req.user.id,
                    comments: []
                })

            await post.save()

            return res.status(201).json({message: 'Post successfully created'});
        }

        catch(err)
        {
            return res.status(500).json({message: err.message})
        }
    })
]

exports.get_post_page = asyncHandler(async(req, res, next) => 
{
    try
    {
        const post = await Posts.findById(req.params.postId).exec()

        if(!post)
        {
            return res.status(404).json({message: 'Post not found'});
        }

        return res.status(200).json(post)
    }

    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})

exports.put_post_page = 
[   
    body('title')
    .optional({checkFalsy: true})
    .trim()
    .isLength({min:1, max:30})
    .isString()
    .escape()
    .withMessage('Title must be a string, length of between min 1 and max 30')
    ,
    body('description')
    .optional({checkFalsy: true})
    .trim()
    .isLength({min:1, max:100})
    .isString()
    .escape()
    .withMessage('Title must be a string, length of between min 1 and max 100')
    ,
    body('text')
    .optional({checkFalsy: true})
    .trim()
    .isLength({min:1})
    .isString()
    .escape()
    .withMessage('Title must be a string')
    ,
    body('published')
    .optional({checkFalsy: true})
    .trim()
    .isBoolean()
    .escape()
    .withMessage('Published must be one of these: true, false')
    ,
    asyncHandler(async(req, res, next) =>
    {
        const errors = validationResolt(req);
        if(!errors.isEmpty())
        {
            res.status(400).json({errors: errors.array()})
        }

        try
        {
            const post = await Posts.findById(req.params.postId).exec();
            if(!post)
            {
                res.status(404).json({message: 'Post not found'})
            }

            if(req.body.title)
            {
                post.name = req.body.title
            }

            if(req.body.description)
            {
                post.description = req.body.description;
            }

            if(req.body.text)
            {
                post.text = req.body.text;
            }

            if(req.body.published)
            {
                user.published = req.body.published;
            }

            await post.save()
            return res.status(200).json({message: 'Post successfully updated'});
        }

        catch(err)
        {
            return res.status(500).json({message: err.message})
        }
    })
]

exports.delete_post_page = asyncHandler(async (req, res, next) =>
{
    try
    {
        const post = await Posts.findById(req.params.postId).exec();
        if(!post)
        {
            res.status(404).json({message: 'Post not found'})
        }

        Posts.findByIdAndDelete(req.params.postId).exec()

        return res.status(200).json({message: 'Post successfully deleted'})
    }

    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})