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
    console.log(email);
    console.log(password);
    User.authenticate(email, password, (err, user) => {
        if (err) {
            res.json({
                "error": err.name
            });
        }
        res.json({
            "data": user
        })
    });
});

// DELETE /session destroys session and redirect to /
router.delete('/', (req, res, next) => {

});

module.exports = router;
