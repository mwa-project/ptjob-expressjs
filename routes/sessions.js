var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET    /session/new gets the webpage that has the login form
router.get('/new', (req, res, next) => {

});

// POST   /session authenticates credentials against database
router.post('/', (req, res, next) => {
    const user_name = req.body.user_name;
    const password = req.body.password;
    // console.log(user_name + ": " + password);
    User.authenticate(user_name, password, (err, user) => {
        if (err) {
            return res.json({
                "error": err
            });
        }
        let token;
        if (user) {
            token = user.generateToken();
            console.log('token: ' + token);
        }
        res.json({
            "data": user,
            "token": token
        })
    });
});

module.exports = router;
