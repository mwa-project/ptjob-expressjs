var jwt = require('jsonwebtoken');

var tokenValidator = (req, res, next) => {
    req.checkAccess = (callback) => {
        try {
            let token = req.headers.access_token;
            if (!token) {
                return callback(false);
            }
            jwt.verify(token, 'mwa', function(err, decoded) {
                if (err) {
                    return callback(false);
                }
                return callback(true, decoded);
            });
        } catch(err) {
            // console.log(err)
        }
    }

    res.unauthorized = () => {
        res.status(401).json({
            "error": {
                "message": "Invalid token!"
            }
        })
    }
    next();
};

module.exports = tokenValidator;
