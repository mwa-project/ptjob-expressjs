var jwt = require('jsonwebtoken');

var tokenValidator = (req, res, next) => {
    console.log('req.originalUrl: ' + req.originalUrl);
    let needValidate = ['/users'];
    if (needValidate.includes(req.originalUrl)) {
        let token = req.headers.access_token;
        if (!token) {
            return failed(res);
        }
        jwt.verify(token, 'mwa', function(err, decoded) {
            if (err) {
                return failed(res);
            }
            next();
          });
    } else {
        next();
    }
};

const failed = (res) => {
    return res.status(401).json({
        "error": {
            "message": "Invalid token!"
        }
    })
}
module.exports = tokenValidator;
