const express = require('express');
const { db } = require('../database/db.js');
const {createSchool} = require('../database/school_db_actions.js');

const router = express.Router();
/*
 api section 
    school add
    school list
    school edit 
    school delete
    school view
    school search 
    school home
    
 page section
    school  add,  view, list, search, edit page

start small l
 name, address
*/

// drop students table
router.get('/sql/drop_schools_table', (req, res) => {
    // drop schools tables 
    db.run('DROP TABLE schools', (err) => {
        if (err) {
            console.error(err.message);
            res.send(err);
            // Handle error if needed
        } else {
            console.log("Schools table dropped successfully");
            res.send({ status: "success", message: "Successfully dropped table schools" });
        }
    });

});
// create student add api
// v2 schools table: id, name, address, school_mobile_number, owner_name, owner_email, owner_mobile_number, password
router.get('/sql/create_schools_table/v2', (req, res) => {
    db.run(`CREATE TABLE schools (
        id INTEGER PRIMARY KEY,
        name VARCHAR(255),
        address VARCHAR(255),
        school_mobile_number VARCHAR(20),
        owner_name VARCHAR(255),
        owner_email VARCHAR(255),
        owner_mobile_number VARCHAR(20),
        password VARCHAR(255)
    );
    `, (err) => {
        if(err){
            console.error(err.message);
            res.send(err);
        }else{
            console.log("Schools table created successfully");
            res.send({ status: "success", message: "Successfully created table schools" });
        }
    });
});
//  page expose to create schools_simple 
router.get('/sql/create_schools_simple_table', (req, res) => {
    db.run(`CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT
    )`, (err) => {
        if (err) {
            console.error(err.message);
            res.send(err);
            // Handle error if needed
        } else {
            console.log("Schools table created successfully");
            res.send({ status: "success", message: "Successfully created table schools" });
        }
    });
});

// delete api 
// view api 
// list api  school
router.get('/api/schools', (req, res) => {
    // Retrieve schools from the 'schools' table
    db.all('SELECT * FROM schools', (err, rows) => {
        if (err) {
            console.error(err.message);
            // Handle error if needed
            res.send(err);
        } else {
            // Pass the retrieved schools to the view
            res.send({ status: "success", schools: rows });
        }
    });
});

// add api
router.post('/api/schools', (req, res) => {
    // Retrieve form fields (name, address) via request body

    createSchool(req.body, (err, row) => {
        if (err) {
            console.error(err.message);
            res.send({ status: "error", message: "Unable to add school" });
        } else {
            res.send({ status: "success", message: "Successfully added school", school: row });
        }
    });
});

//delete api
router.delete('/api/schools/:id', (req, res) => {
    const schoolId = req.params.id;
    db.run('DELETE FROM schools WHERE id = ?', schoolId, function (err) {
        if (err) {
            console.error(err.message);
            // Handle error if needed
            res.send({ status: "error", message: "Unable to delete school" });
        } else {
            res.send({ status: "success", message: "Successfully deleted school" });
        }
    });
});

router.get('/schools/add', (req, res) => {
    res.render('schools/add');
});

router.post('/schools/add', (req, res) => {
    // Retrieve form fields (name, address) via request body
    const { name, address } = req.body;
    console.log("name: " + name + ", address: " + address);

    // Run SQLite query to insert school (name, address) into the database
    const query = 'INSERT INTO schools (name, address) VALUES (?, ?)';
    db.run(query, [name, address], function (err) {
        if (err) {
            console.error(err.message);
            res.send("unable to add school")
            // Handle error if needed
        } else {
            // School inserted successfully
            console.log('School added:', this.lastID);
            // Redirect to the list page or send a success message
            res.redirect('/schools');
        }
    });
});

// list schools 
const sqlite3 = require('sqlite3').verbose();

router.get('/schools', (req, res) => {
    // Retrieve schools from the 'schools' table
    db.all('SELECT * FROM schools', (err, rows) => {
        if (err) {
            console.error(err.message);
            // Handle error if needed
            res.send(err);
        } else {
            // Pass the retrieved schools to the view
            res.render('schools/list', { schools: rows });
        }
    });
});

// edit school page
router.get('/schools/:id/edit', (req, res) => {
    const schoolId = req.params.id;
    db.get('SELECT * FROM schools WHERE id = ?', schoolId, (err, row) => {
        if (err) {
            console.error(err.message);
            // Handle error if needed
            res.redirect('/schools');
        } else {
            const school = row;
            res.render('schools/edit', { school });
        }
    });
});

// schools edit action post
router.post('/schools/:id/edit', (req, res) => {
    const schoolId = req.params.id;
    const { name, address } = req.body;

    // Replace the code below with your actual database update logic
    // Update the school in the database based on the provided schoolId
    db.run('UPDATE schools SET name = ?, address = ? WHERE id = ?', [name, address, schoolId], function (err) {
        if (err) {
            console.error(err.message);
            // Handle error if needed
            res.redirect(`/schools/${schoolId}/edit`);
        } else {
            res.redirect('/schools');
        }
    });
});

module.exports = router;



