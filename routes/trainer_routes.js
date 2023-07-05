const express = require('express');
const router = express.Router();
const path = require('path');

const {addTrainer, listTrainers, deleteTrainerById} 
    = require('../database/trainer_db_actions.js');

// add trainer route render views/trainers/add.ejs
router.get('/trainers/add', (req, res) => {
    res.render('trainers/add');
});

// add trainer api route, accept trainer in json body, 
    //save to db via addTrainer
router.post('/api/trainers', (req, res) => {
    const { name, mobile_number } = req.body;
    console.log("name, mobile_number", name, mobile_number)
    addTrainer(name, mobile_number, (err) => {
        if (err) {
            console.error(err);
            console.log("failed to add trainer err:", err.message)
            res.status(500).send('Internal Server Error');
        } else {
            res.json({success: true, message: 'Trainer added successfully'})
        } 
    });
});

// list trainer api route, reeturn list of trainers in json 
    //format via listTrainers
router.get('/api/trainers', (req, res) => {
    console.log("inside api trainers llist");
    listTrainers((err, rows) => {
        console.log("inside list trainers callback  ");
        if (err) {
            console.error("trainers api:  unable to retrieve trainers : err:", err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("rows: ", rows);
            res.json(rows);
        }
    });
});

// list trainer route render views/trainers/list.ejs
router.get('/trainers/list', (req, res) => {
    listTrainers((err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("rows: ", rows);
            res.render('trainers/list', { trainers: rows });
        }
    });
});
// delete trainer api route, accept trainer id, delete trainer
router.delete('/api/trainers/:id', (req, res) => {
    const { id } = req.params;
    deleteTrainerById(id, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json({success: true, message: 'Trainer deleted successfully'})
        }
    });
});

module.exports = router;