const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.login = 
[
    body('username')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('Username should be entered')
    ,
    body('password')
    .trim()
    .isLength({min: 1})
    .escape()
    .withMessage('Password must be entered')
    ,
    asyncHandler(async(req, res, next) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()});
        }

        try
        {
            const user = await Users.findOne({name: req.body.username});
            if(!user)
            {
                return res.status(404).json({message: 'User not found'});
            }

            const match = await bcrypt.compare(req.body.password, user.password)

            if(!match)
            {
                return res.status(401).json({message: 'Wrong password, access is denied.'});
            }

            const token = jwt.sign({sub: user.id}, process.env.SECRET, {expiresIn: '6h'})

            return res.status(200).json({message: 'Logged successfully', token})
        }

        catch(err)
        {
            return res.status(500).json({message: err.message})
        }
    })
]

exports.sign_up = 
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
            const errors = validationResult(req);
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

exports.get_me = asyncHandler(async(req, res, next) => 
{
    try
    {
        const user = await Users.findById(req.user.id)
        
        if(!user)
        {
            return res.status(404).json({message: 'User not found'});        
        }

        return res.status(200).json(user)
    }
    catch(err)
    {
        return res.status(500).json({message: err.message})
    }
})