const express = require('express');
const router = express.Router();
const {db, addClass, listClasses, deleteClassById} = require('../database/class_db_actions.js');

console.log('db in class_routes.js', db);
console.log("add class ", addClass);

// add as driving class
router.get('/classes/add/:studentId', (req, res) => {
    var studentId = req.params.studentId;
    console.log("inside add class route studentId: ", studentId);
    // const {listTrainers} = require('../database/trainer_db_action?s.js');
    res.render('classes/add', 
        { studentId: req.params.studentId ,
            // TODO temporary for now , later, we allow manager,owner to select trainer
            trainerId : '1'
        }
    );
});

// create route for handling add driving class form 
router.post('/api/classes', (req, res) => {
    console.log("insdie api classes");
    const { student_id, trainer_id, date, time_start, time_end } = req.body;
    console.log("student_id, trainer_id, date, time_start, time_end", student_id, trainer_id, date, time_start, time_end)

    addClass(student_id, trainer_id, date, time_start, time_end, (err) => {
        console.log("inside add class callback route post")
        if (err) {
            console.error(err);
            console.log("failed to add class err:", err.message)
            res.status(500).send('Internal Server Error');
        } else {
            // res.redirect('/classes/list/' + student_id);
            // generate success response 
            res.json({success: true, message: 'Class added successfully'})
        } 
    });
    
});

// List all classes
router.get('/classes/list/:studentId', (req, res) => {
    console.log("inside classes list student id: " + req.params.studentId);
    // List classes logic here
    const classes = [];

    const studentId = req.params.studentId;
    listClasses(studentId, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("rows: ", rows);
            console.log("rendering classes list");
            // todo if possible student: student, trainers: trainers pass
            res.render('classes/list', { classes: rows });
        }
    });
});

// create delete class route given class id 
router.delete('/api/classes/:classId', (req, res) => {
    console.log("inside delete class route");
    var classId = req.params.classId;
    deleteClassById(req.params.classId, (err) => {
        if (err) {
            console.error("Unable to delete class  id: " + classId, err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("deleted class id: " + classId);
            res.json({success: true, message: 'Class deleted successfully'})
        }
    });
});

module.exports = router;
