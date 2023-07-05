const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('skool.db');

function createClassTable(callback) {
    db.run(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        trainer_id INTEGER,
        date DATE,
        time_start TEXT,
        time_end TEXT
      )`, (err) => {
        if (err) {
            console.log(" error created classes table ", err.message);
            callback(err);
        }else{
            console.log("classes table created");
            callback(null);
        }
    });
}

// write function to list clasess 
function listClasses(studentId, callback) {
    const classes = [];
    // retreive from db filter by student Id
    const query = 'SELECT * FROM classes WHERE student_id = ?';
    db.all(query, [studentId], (err, rows) => {
        if (err) {
            console.error(err);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// write funtion to add class row
function addClass(studentId, trainerId, date, timeStart, timeEnd, callback) {
    console.log("inside add class function");
    const query = 'INSERT INTO classes (student_id, trainer_id, date, time_start, time_end) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [studentId, trainerId, date, timeStart, timeEnd], (err) => {
        console.log("insert classes table row function respond back");
        if (err) {
            console.error("error adding class:" + err);
            callback(err);
        } else {
            console.log("successfully added class")
            callback(null);
        }
    });
}

// write function delete class by clas id
function deleteClassById(classId, callback) {
    const query = 'DELETE FROM classes WHERE id = ?';
    db.run(query, [classId], (err) => {
        if (err) {
            console.error("error deleting class by class id:"
                + classId + " is err:" + err);
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports = { db, listClasses, addClass, deleteClassById };