
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('skool.db');

//create function to get student by id
function getStudentById(id, callback) {
    db.get(`SELECT * FROM students WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.log(err.message);
            // send error response
            return callback(err);
        }
        // send json resposne with row
        callback(null, row);
    });
}

function getAllStudents(callback) {
    db.all(`SELECT * FROM students`, (err, rows) => {
        if (err) {
            console.log(err.message);
            // send error response
            return callback(err, null);
        }
        // send json resposne with row
        callback(null, rows);
    });
}

// create student from name, mobileNumber, joiningDate, applicationNumber, amount, discount, amountPaid, settleAmount, course, trainingDays
function createStudent(name, mobileNumber, joiningDate,
    applicationNumber, amount, discount, amountPaid,
    settleAmount, course, trainingDays
    ,callback) {
    const sql = 'INSERT INTO students (name, mobileNumber, joiningDate, applicationNumber, amount, discount, amountPaid, settleAmount, course, trainingDays) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(sql,
        [name, mobileNumber, joiningDate, applicationNumber,
            amount, discount, amountPaid, settleAmount,
            course, trainingDays],
        function (err) {
            if (err) {
                console.error(err.message);
                callback(err);
            }

            callback(null);
        }
    );
}

// search student by mobile number
function searchStudentByMobileNumber(mobileNumber, callback) {
    db.all(`SELECT * FROM students WHERE mobileNumber = ?`, [mobileNumber], (err, rows) => {
        if (err) {
            callback(err, null);
        }
        callback(null, rows)
    });
}

// delete studnt by id 
function deleteStudentById(studentId, callback) {
    db.run(`DELETE FROM students WHERE id = ?`, [studentId], function (err) {
        if (err) {
            console.log(err.message);
            callback(err);
        }
        if (this.changes > 0) {
            callback(null);
        } else {
            callback({ message: 'Student not found.' })
        }
    });
}

// update student by id, new parameters
function updateStudentById(studentId,
    name, mobileNumber, joiningDate, applicationNumber,
    amount, discount, amountPaid, settleAmount,
    course, trainingDays, callback) {
    db.run(`UPDATE students SET name = ?, mobileNumber = ?, joiningDate = ?, applicationNumber = ?, amount = ?, discount = ?, amountPaid = ?, settleAmount = ?, course = ?, trainingDays = ? WHERE id = ?`,
        [name, mobileNumber, joiningDate, applicationNumber,
            amount, discount, amountPaid, settleAmount,
            course, trainingDays, studentId],
        function (err) {
            if (err) {
                console.log(err.message);
                callback(err);
            }
            if (this.changes > 0) {
                callback(null);
            } else {
                callback({ message: 'Student not found.' })
            }
        });
}

module.exports = {
    getStudentById, getAllStudents,
    createStudent, searchStudentByMobileNumber,
    deleteStudentById, updateStudentById
}