const passport = require('passport');

exports.authorize = ((ranks = []) => 
    {
        if(typeof ranks === 'string')
        {
            ranks = [ranks]
        }
   

    return [
        passport.authenticate('jwt', {session: false}),
        (req, res, next) => 
        {
            if(ranks.length && !ranks.include(req.user.rank))
            {
                return res.status(401).json({message: 'Forbidden'})
            }
            next();
        }
    ]
})