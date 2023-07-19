const path = require('path');
// const sqlite3 = require('sqlite3').verbose();

// const db = new sqlite3.Database('../skool.db');
const {db} = require('./db.js');

console.log("trainer db actions db: ", db)

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

// delete trainer table
function dropTrainerTable(callback) {
    db.run(`DROP TABLE IF EXISTS trainers`, (err) => {
        if (err) {
            console.log(" error deleting trainers table ", err.message);
            callback(err);
        }else{
            console.log("trainers table deleted");
            callback(null);
        }
    });
}

// write function to list clasess 
function listTrainers(callback) {
    console.log("inside list trainers function");
    const query = 'SELECT * FROM trainers';
    console.log("db file name: db.filename: ", db.filename);
    db.all(query, [], (err, rows) => {
        console.log(" list trainers: rows: ", rows);
        console.log(" list trainers: err: ", err);
        if (err) {
            console.error(" unable to retrieve trainers, error : ", err);
            callback(err, null);
        } else {
            console.log('list trainers: able to retrieve trainer wihtout error');
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

function getTrainerById(trainerId, callback) {
    const query = 'SELECT * FROM trainers WHERE id = ?';
    db.get(query, [trainerId], (err, row) => {
        if (err) {
            console.error("error fetching trainer by id:"
                + trainerId + " is err:" + err);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

module.exports = { db, 
    listTrainers, addTrainer,
    deleteTrainerById, getTrainerById,

    dropTrainerTable,
    createTrainerTable
};