var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  // User.find({}, (err, users) => {
  //   if (err) throw err;
  //   res.json({
  //     "data": users
  //   });
  // });

  req.checkAccess((authenticated, json) => {
    if (!authenticated) {
      return res.unauthorized();
    }
    console.log(json);

    User.find({}, (err, users) => {
      if (err) throw err;
      res.json({
        "data": users
      });
    });
  });
});

/* POST new user */
router.post('/', function (req, res, next) {
  var carl = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
    email: req.body.email,
    user_name: req.body.user_name
  });
  carl.save(err => {
    if (err) {
      console.log("save error" + err);
      res.send({
        "error": {
          "code": 520,
          "message": err
        }
      });
    } else {
      res.json({
        "data": null
      });
    }

  });
});

router.delete('/:username', (req, res, next) => {
  User.findOneAndRemove({ user_name: req.params.username }, (err) => {
    if (err) {
      res.json({
        "error": {
          "error": 520,
          "message": err
        }
      });
    } else {
      res.json({ "data": null });
    }
  });
});

// GET  /users/new gets the webpage that has the registration form
// POST /users records the entered information into database as a new /user/xxx
// GET  /users/xxx // gets and renders current user data in a profile view
// POST /users/xxx // updates new information about user

module.exports = router;
