var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {

  req.checkAccess((authenticated, json) => {
    if (!authenticated) {
     return res.unauthorized();
    }
    // console.log(json);

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

    let location = {  
      city:  req.body.city,
       state : req.body.state,
      zipcode : req.body.zipCode,
      type : 'point',
      coordinates : [ req.body.longitude, req.body.latitude ]
    }

    let user = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    user_name: req.body.userName,
    date_of_birth: req.body.dateOfBirth ,
    location: location

  });

  user.save(err => {
    if (err) {
      // console.log("save error" + err);
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
router.put('/', (req,res,next) => {
  console.log('HALO');
  console.log(req.body.educations);
  User.findOneAndUpdate({user_name: req.body.user_name}
    , {$set: {educations: req.body.educations
      // [{
      // school_name:req.body.school_name,//"University of Indonesia", 
      // degree :req.body.degree,//"Bachelor",
      // field_study:req.body.field_study,//"Computer Science", 
      // start_year:req.body.start_year,//2003,
      // end_year:req.body.end_year,//2007,
      // description: req.bodydescription//."test"
      
      // }] 
    } }
    , (err, user)=> {

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
