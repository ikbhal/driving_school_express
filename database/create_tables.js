

// const sqlite3 = require('sqlite3').verbose();

// let db = new sqlite3.Database('skool.db', (err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Connected to the SQLite database.');
// });

const {db} = require('./db.js');

function createTables() {
    // tod can we wait to complete one by one  and then return 
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mobileNumber TEXT,
        joiningDate DATE,
        applicationNumber TEXT,
        amount NUMERIC,
        discount NUMERIC,
        amountPaid NUMERIC,
        settleAmount NUMERIC,
        course TEXT,
        trainingDays INTEGER
    )`, (err) => {
        if (err) {
            return console.log(err.message);
        }
    });

    // Create the driving_school table
    db.run(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        trainer_id INTEGER,
        date DATE,
        time_start TEXT,
        time_end TEXT
    )`, (err) => {
        if (err) {
            return console.log(err.message);
        }
    });

}

function dropTables() {
    // TODO run drop table one by one and then return
    db.run('drop table students', (err) => {
        if (err) {
            console.log("error in droping table err: ", err.message)
        } else {
            console.log("successfully droped table");
        }
    });
    db.run('drop table classes', (err) => {
        if (err) {
            console.log("error in droping table err: ", err.message)
        } else {
            console.log("successfully droped table");
        }
    });

    db.run('drop table trainers', (err) => {
        if (err) {
            console.log("error in droping table err: ", err.message)
        } else {
            console.log("successfully droped table");
        }
    });
}
module.exports = { createTables, dropTables };