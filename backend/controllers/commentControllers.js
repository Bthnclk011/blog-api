const asyncHandler = require('express-async-handler');
const { body, validationResult} = require('express-validator');
const Posts = require('../models/Posts');
const Comments = require('../models/Comments');

exports.get_comments = asyncHandler(async(req, res, next) => 
{
    try
    {
        const posts = await Posts.findById(req.params.postId).populate('comments').exec();

        if(!posts)
        {
            return res.status(404).json({message: 'Post not found'})
        }

        if(!posts.comments || post.comments.length === 0)
        {
            return res.status(404).json({message: 'Comments not found'})
        }
        return res.status(200).json(post.comments)
    }
    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})

exports.post_comment = 
[   body('comment')
    .trim()
    .isLength({min: 1, max:30})
    .isString()
    .escape()
    .withMessage('Comment must be a string, with length of min 1 and max 30')
    ,
    asyncHandler(async(req, res, next) => 
    {
        const errors = validationResult(req)
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()})
        }

        try
        {
            const comment = new Comments(
                {
                    comment: req.body.comment,
                    date: new Date(),
                    author: req.user.id || 'Guest'
                })

            const post = await Posts.findById(req.params.postId).populate('comment').exec();

            if(!post)
            {
                return res.status(404).json({message: 'Post not found'});
            }

            await comment.save();
            post.comments.push(comment);
            await post.save();

            return res.status(201).json({message: 'Comment is created'});

        }

        catch(err)
        {
            return res.status(500).json({message: err.message})
        }
    })
]

exports.get_comment = asyncHandler(async(req, res, next) => 
{
    try
    {
        const comment = await Comments.findById(req.params.commentId).exec();
        if(!comment)
        {
            return res.status(404).json({message: 'Comment not found'})
        }

        return res.status(200).json(comment)
    }

    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})

exports.put_comment = 
[   body('comment')
    .trim()
    .isLength({min: 1, max:30})
    .isString()
    .escape()
    .withMessage('Comment must be a string, with length of min 1 and max 30')
    ,
    asyncHandler(async(req, res, next) => 
    {
        const errors = validationResult(req)
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()})
        }

        try
        {
            const comment = await Comments.findById(req.params.commentId);
            const post = await Posts.findById(req.params.postId);

            if(!post)
            {
                return res.status(404).json({message: 'Post not found'});
            }
            if(!comment)
            {
                return res.status(404).json({message: 'Comment not found'});
            }

            comment.comment = req.body.comment;
            await comment.save();

            return res.status(200).json({message: 'Comment is created'});

        }

        catch(err)
        {
            return res.status(500).json({message: err.message})
        }
    })
]

exports.delete_comment = asyncHandler(async(req, res, next) => 
{
    try
    {
        const comment = await Comments.findById(req.params.commentId);

        if(!comment)
        {
            return res.status(404).json({message: 'Comment not found'});
        }

        return res.status(200).json({message: 'Comment is deleted'});
    }

    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})