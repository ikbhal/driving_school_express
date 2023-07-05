
const express = require('express');
const router = express.Router();
const {register, login} = require('../database/auth_db_actions');


// create registration api ,accept json body 
// school name, address, mobile number, owner name, owner email, password, owner mobile number
// API registration
router.post('/api/register', (req, res) => {
    console.log("inside register route");
    const school = req.body;
    register(school, (err) => {
        if(err) {
            console.log("error in register: ", err);
            res.status(500).json({status: 'fail', err: err});
        }   else {
            res.json({status: 'success', message: 'school registered successfully'});
        }
    });
});

// API login
router.post('/api/login', (req, res) => {
    res.send('login api');
    const {owner_email, password} = req.body;
    // login(owner_email, password, callback)
    login(owner_email, password, (err, row) => {
        if(err){
            console.log("error in login: ", err);
            // res.status(500).json({status: 'fail', err: err});
            res.status(500);
        }else {
            // send json response with row
            res.json(row);
        }
    }); 
});

//  webpage registraion
// TODO hide the navigation on register
router.get('/register', (req, res) => {
    // res.send('register page');
    // fetch all fields from req.body json
   res.render('auth/register');

});

//  web page login
// TODO hide the navigation on login
router.get('/login', (req, res) => {
    // res.send('login page');
    res.render('auth/login');
});


module.exports = router;