const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../skool.db');

function createTrainerTable(callback) {
    db.run(`CREATE TABLE IF NOT EXISTS trainers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mobile_number TEXT
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
function listTrainers(callback) {
    const query = 'SELECT * FROM trainers';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// write funtion to add class row
function addTrainer(name, mobileNumber, callback) {
    console.log("inside add trainer function");
    const query = 'INSERT INTO trainers (name, mobile_number) VALUES (?, ?)';
    db.run(query, [name, mobileNumber], (err) => {
        if (err) {
            console.error("error adding class:" + err);
            callback(err);
        } else {
            callback(null);
        }
    });
}

function deleteTrainerById(trainerId, callback) {
    const query = 'DELETE FROM trainers WHERE id = ?';
    db.run(query, [trainerId], (err) => {
        if (err) {
            console.error("error deleting trainer by  id:"
                + trainerId + " is err:" + err);
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports = { db, createTrainerTable, 
    listTrainers, addTrainer,
    deleteTrainerById
};