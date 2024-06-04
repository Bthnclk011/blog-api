const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Users = require('../models/Users');
const Posts = require('../models/Posts');

exports.authorize = ((ranks = []) => 
{
    return [
        passport.authenticate('jwt', {session: false}),
        (req, res, next) => 
        {
            if(ranks.length && !ranks.includes(req.user.rank))
            {
                return res.status(401).json({message: 'Forbidden'})
            }
            next();
        }
    ]
})

exports.userAuthorize = asyncHandler(async(req, res, next) => 
{
    const user = await Users.findById(req.user.id).exec();

    if(!user)
    {
        return res.status(404).json({message: 'User not found'});
    }

    if(req.user.rank !== 'admin' || req.user.id !== userid)
    {
        return res.status(401).json({message: 'Forbidden'})
    }

    next();
})

exports.postAuthorize = asyncHandler(async(req, res, next) => 
{
    const post = await Posts.findById(req.params.id).populate('author').exec();
    const postUser = post.author.id;

    if(!post)
    {
        return res.status(404).json({message: 'Post not found'});
    }

    if(req.user.rank !== 'admin' && req.user.id !== postUser)
    {
        return res.status(401).json({message: 'Forbidden'})
    }

    next();
})