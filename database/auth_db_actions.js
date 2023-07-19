
// TODO owner email , password to school email, school password
// TODO later segrate employee of school
// TOOD employee role, owner, manger, receiptionst, admin, trainer or teacher
// attach employee to school
// TODO control opetationmby role later 
// ITS big effort we will take it later

const {db} = require('./db.js');
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

// TODO passord encrypted password
function getSchoolByAuth(owner_email, password, callback) {
    console.log('get school by auth');
    db.get(`SELECT * FROM schools WHERE owner_email = ? AND password = ?`,
        [owner_email, password], (err, row) => {
        console.log("getSchoolByAuth row: ", row);
        console.log("getSchoolByAuth error: ", err);
        if (err) {
            console.log(err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
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
    register, login
};