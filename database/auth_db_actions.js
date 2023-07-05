const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('skool.db');


// TODO owner email , password to school email, school password
// TODO later segrate employee of school
// TOOD employee role, owner, manger, receiptionst, admin, trainer or teacher
// attach employee to school
// TODO control opetationmby role later 
// ITS big effort we will take it later
function createSchoolTable() {
    console.log('create school table');
    // SQL query to create the school table
    const query = `
      CREATE TABLE IF NOT EXISTS school (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        school_mobile_number TEXT,
        owner_name TEXT,
        owner_email TEXT,
        owner_mobile_number TEXT,
        password TEXT
      )
    `;

    // Execute the SQL query
    db.run(query, (error) => {
        if (error) {
            console.error('Error creating school table:', error.message);
        } else {
            console.log('School table created successfully');
        }
    });
}

function createSchool(school,
    callback){
    const {name, address, school_mobile_number, 
        owner_name, owner_email, 
        owner_mobile_number, password
    } = school;
    console.log('create school');
    const query = `
        INSERT INTO school 
        (name, address, school_mobile_number, owner_name, 
            owner_email, owner_mobile_number, password)
         VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query,
        [name, address, school_mobile_number,
             owner_name, owner_email, 
             owner_mobile_number, password],
        function (err) {
            if (err) {
                console.error(err.message);
                callback(err);
            }

            callback(null);
        }
    );
}

function getSchoolById(id, callback) {
    console.log('get school by id');
    db.get(`SELECT * FROM school WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.log(err.message);
            // send error response
            return callback(err);
        }
        // send json resposne with row
        callback(null, row);
    });
}

// TODO passord encrypted password
function getSchoolByAuth(owner_email, password, callback) {
    console.log('get school by auth');
    db.get(`SELECT * FROM school WHERE owner_email = ? AND password = ?`,
        [owner_email, password], (err, row) => {
        if (err) {
            console.log(err.message);
            // send error response
            return callback(err, null);
        }
        // send json resposne with row
        callback(null, row);
    });
}

function register(school, callback) {
    console.log('register');
    createSchool(school, callback);
}

function login(owner_email, password, callback) {
    console.log('login');
    getSchoolByAuth(owner_email, password, callback);
}

module.exports = {
    createSchoolTable,
    createSchool,
    register, login
};