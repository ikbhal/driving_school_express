const express = require('express');
const router = express.Router();

const { getStudentById, getAllStudents,
    createStudent, searchStudentByMobileNumber,
    deleteStudentById, updateStudentById }
    = require('../database/student_db_actions.js');

// add student page 
router.get('/students/add', (req, res) => {
    res.render('students/add');
});

// generate view page for student id
router.get('/students/details/:id', (req, res) => {
    //feth student by id 
    getStudentById(req.params.id, (err, row) => {
        if (err) {
            console.log("error in fetching student by id err: ", err.message);
            res.render('students/view', { student: null });
        }
        res.render('students/view', { student: row });
    });

});

// list student page
router.get('/students', (req, res) => {
    getAllStudents((err, rows) => {
        if (err) {
            console.log("error in fetching student by id err: ", err.message);
            res.render('students/list', { students: [], err: err });
        } else {
            res.render('students/list', { students: rows, err: null })
        }
    });
});

// edit student by id page
router.get('/students/edit/:id', (req, res) => {
    getStudentById(req.params.id, (err, row) => {
        if (err) {
            console.log("error in fetching student by id err: ", err.message);
            res.render('students/edit', { student: null, err: err });
        } else {
            res.render('students/edit', { student: row, err: null });
        }
    });
});

// create student post api
router.post('/api/students', (req, res) => {
    const { name, mobileNumber, joiningDate, applicationNumber, amount, discount, amountPaid, settleAmount, course, trainingDays } = req.body;

    createStudent(name, mobileNumber, joiningDate,
        applicationNumber, amount, discount, amountPaid,
        settleAmount, course, trainingDays,
        (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to add student.' });
            } else {
                res.json({ status: "success", message: 'Student added successfully.' });
            }
        });
});


router.get('/students/dummy', (req, res) =>{
    res.send("dummy studnets");
})
// student search page
router.get('/students/search', (req, res) => {
    console.log('student search page');
    res.render('students/search');
});

// get student by id api 
router.get('/api/student/:id', (req, res) => {
    getStudentById(req.params.id, (err, row) => {
        if (err) {
            console.log("error in fetching student by id err: ", err.message);
            res.status(500).json({ error: 'Failed to search for students.' });
        } else {
            res.json(row);
        }
    });
});

// get all students api
router.get('/api/students', (req, res) => {
    getAllStudents((err, rows) => {
        if (err) {
            //return error response
            res.status(500).json({ error: 'Failed to search for students.' });
        } else {
            //return all students in json 
            res.json(rows);
        }
    });
});

// search student api 
router.get('/api/search', (req, res) => {
    //searchStudentByMobileNumber
    searchStudentByMobileNumber(req.query.mobileNumber, (err, rows) => {
        if (err) {
            //return error response
            res.status(500).json({ error: 'Failed to search for students.' });
        } else {
            //return all students in json 
            res.json(rows);
        }
    });
});

// delete student by id appi
router.delete('/api/student/:id', (req, res) => {
    deleteStudentById(req.params.id, (err) => {
        if (err) {
            //return error response
            res.status(500).json({ error: 'Failed to delete student.' });
        } else {
            //return all students in json 
            res.json({ status: "success", message: 'Student deleted successfully.' });
        }
    });
});

// update student by id api 
router.put('/api/students/:id', (req, res) => {
    var studentId = req.params.id;
    // destruction req.body to paramters
    const { name, mobileNumber, joiningDate,
        applicationNumber, amount, discount,
        amountPaid, settleAmount, course,
        trainingDays } = req.body;
    updateStudentById(studentId,
        name, mobileNumber, joiningDate,
        applicationNumber, amount, discount,
        amountPaid, settleAmount, course,
        trainingDays, (err) => {

            if (err) {
                //return error response
                res.status(500).json({ error: 'Failed to update student.' });
            } else {
                //return all students in json 
                res.json({ status: "success", message: 'Student updated successfully.' });
            }

        });

});

// get students by id api , return student in json
router.get('/api/students/:id', (req, res) => {
    getStudentById(req.params.id, (err, row) => {
        if (err) {
            //return error response
            res.status(500).json({ error: 'Failed to search for students.' });
        } else {
            //return all students in json 
            res.json(row);
        }
    });
});



module.exports = router;