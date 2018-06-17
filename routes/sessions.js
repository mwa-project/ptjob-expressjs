var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET    /session/new gets the webpage that has the login form
router.get('/new', (req, res, next) => {

});

// POST   /session authenticates credentials against database
router.post('/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.authenticate(email, password, (err, user) => {
        // console.log('err:' + err);
        // console.log('user: ' + user);
        if (err) {
            return res.json({
                "error": err
            });
        }
        let token;
        if (user) {
            token = user.generateToken();
        }
        res.json({
            "data": user,
            "token": token
        })
    });
});

// DELETE /session destroys session and redirect to /
router.delete('/', (req, res, next) => {

});

module.exports = router;
