const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');

exports.get_users = asyncHandler(async(req, res, next) =>
{
    try
    {
        const users = await Users.find().exec()
        return res.json(users)
    }
    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})

exports.post_user = 
[
    body('name')
    .isLength({min: 1, max: 20})
    .trim()
    .isString()
    .escape()
    .withMessage('Name must be entered,  must be string, length of min 1 max 20')
    ,
    body('password')
    .isLength({min: 6})
    .trim()
    .escape()
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one symbol character')
    ,
    body('rank')
    .optional({checkFalsy: true})
    .trim()
    .isIn(['admin', 'editor', 'author', 'user'])
    .escape()
    .withMessage('Rank must be one of the admin, editor, author or user options')
    ,
    body('age')
    .optional({checkFalsy: true})
    .trim()
    .isNumeric()
    .withMessage('Age should be a number')
    ,
    body('gender')
    .optional({checkFalsy:true})
    .trim()
    .isIn(['M', 'F', 'N/S'])
    .escape()
    .withMessage('Gender should be M, F or N/S')
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
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new Users(
                {
                    name: req.body.name,
                    password: hashedPassword,
                    regDate: new Date(),
                    rank: req.body.rank,
                    age: req.body.age,
                    gender: req.body.gender
                })

            await user.save()
            return res.status(201).json({ message: 'User registered succesfully'})
        }

        catch(err)
        {
            return res.status(500).json({ message: err.message })
        }
    })
]

exports.get_user = asyncHandler(async(req, res, next) =>
{
    try
    {
        const user = await Users.findById(req.params.userId).exec();

        if(!user)
        {
            return res.status(404).json({message: 'User not found'});
        }
        
        return res.status(200).json(user);
    }

    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
}) 

exports.put_user = 
[
    body('name')
    .optional({checkFalsy: true})
    .isLength({min: 1, max: 20})
    .trim()
    .isString()
    .escape()
    .withMessage('Name must be entered,  must be string, length of min 1 max 20')
    ,
    body('password')
    .optional({checkFalsy: true})
    .isLength({min: 6})
    .trim()
    .escape()
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one symbol character')
    ,
    body('rank')
    .optional({checkFalsy: true})
    .trim()
    .isIn(['admin', 'editor', 'author', 'user'])
    .escape()
    .withMessage('Rank must be one of the admin, editor, author or user options')
    ,
    body('age')
    .optional({checkFalsy: true})
    .trim()
    .isNumeric()
    .withMessage('Age should be a number')
    ,
    body('gender')
    .optional({checkFalsy:true})
    .trim()
    .isIn(['M', 'F', 'N/S'])
    .escape()
    .withMessage('Gender should be M, F or N/S')
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
            const user = await Users.findById(req.params.userId).exec()
            if(!user)
            {
                return res.status(404).json({message: 'User not found'});
            }

            if(req.body.name)
            {
                user.name = req.body.name
            }

            if(req.body.password)
            {
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                user.password = hashedPassword;
            }

            if(req.body.age)
            {
                user.age = req.body.age;
            }

            if(req.body.gender)
            {
                user.gender = req.body.gender;
            }

            if(req.body.rank)
            {
                user.rank = req.body.rank;
            }

            await user.save()
            return res.status(200).json({ message: 'User updated succesfully'})
        }

        catch(err)
        {
            return res.status(500).json({ message: err.message })
        }
    })
]

exports.delete_user = asyncHandler(async(req, res, next) =>
{
    try
    {
        const user = await Users.findById(req.params.userId).exec();
        if(!user)
        {
            return res.status(404).json({message: 'User not found'})
        }

        await Users.findByIdAndDelete(req.params.userId)
        return res.status(200).json({message: 'User deleted successfully'})
    }
   
    catch(err)
    {
        return res.status(500).json({message: err.message})
    }

})