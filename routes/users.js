var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, (err, users) => {
    res.json({
      "data": users
    });
  });
});

router.post('/', function(req, res, next) {
  var carl = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  });
  carl.save(err => {
    if (err) {
      console.log(err.name);
      res.send({
        "error": {
          "code": 520,
          "message": err.name
        }
      });
    } else {
      res.json({
        "data": null
      });
    }
    
  });
});

module.exports = router;
