const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// class routes
const classRoutes = require('./routes/class_routes.js');
app.use( classRoutes);

// trainer routes
const trainerRoutes = require('./routes/trainer_routes.js');
app.use( trainerRoutes);

const {createTrainerTable} = require('./database/trainer_db_actions.js');
createTrainerTable( (err) => {
  if (err) {
    console.log("error in creating table trainers errr:", err)
  } else{
    console.log('succesfully created table trainers');
  }
});

//testing, remove after testing
app.get('/testbase', (req, res) => {
  res.render('testbaseuse');
});

let db = new sqlite3.Database('skool.db', (err) => {
  if (err) {
      return console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});


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

// use to drop the table
// db.run('drop table students', (err) => {
//   if(err){
//     console.log("error in droping table err: ", err.message)
//   }else{
//     console.log("successfully droped table");
//   }
// });

app.get('/add', (req, res) => {
    // res.sendFile(__dirname + '/views/add.html');
    res.render('add');
});

app.get('/', (req, res) => {
  res.redirect('/students');
});

// generate view route for student id
app.get('/students/:id', (req, res) => {
  //feth student by id 
  db.get(`SELECT * FROM students WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    res.render('view', { student: row });
  });
  
});

app.get('/students', (req, res) => {
    // fetch all students from database, then render the to list.ejs , pass students
    db.all(`SELECT * FROM students`, (err, rows) => {
      if (err) {
        return console.log(err.message);
      }
  
      res.render('list', { students: rows });
    });
});

// please generate edit stuent by id form , path /students/edit/:id
// get studente by id from db 
// then render the edit.ejs , pass student
// TODO edit.ejs with chatgpt or copiletion ai
app.get('/students/edit/:id', (req, res) => { 
  db.get(`SELECT * FROM students WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return console.log(err.message);
    }

    res.render('edit', { student: row });
  });

});



db.run('CREATE TABLE if not exists students(id INTEGER PRIMARY KEY AUTOINCREMENT, name text, mobileNumber text)', (err) => {
  if (err) {
    return console.log(err.message);
  }
});


app.post('/api/students', (req, res) => {
  const { name, mobileNumber, joiningDate, applicationNumber, amount, discount, amountPaid, settleAmount, course, trainingDays } = req.body;

  // Insert the student into the database
  const sql = 'INSERT INTO students (name, mobileNumber, joiningDate, applicationNumber, amount, discount, amountPaid, settleAmount, course, trainingDays) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, mobileNumber, joiningDate, applicationNumber, amount, discount, amountPaid, settleAmount, course, trainingDays], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to add student.' });
    }

    res.json({ id: this.lastID, message: 'Student added successfully.' });
  });
});


app.get('/api/student/:id', (req, res) => {
    db.get(`SELECT * FROM students WHERE id = ?`, [req.params.id], (err, row) => {
      if (err) {
        return console.log(err.message);
      }
  
      res.send(row);
    });
});

app.get('/search', (req, res) => {
  res.render('search');
});

app.get('/edit/:id', (req, res) => {
  res.sendFile(__dirname + '/views/edit.html');
});

app.get('/api/students', (req, res) => {
    db.all(`SELECT * FROM students`, (err, rows) => {
      if (err) {
        return console.log(err.message);
      }
  
      res.send(rows);
    });
});

app.get('/api/search', (req, res) => {
  db.all(`SELECT * FROM students WHERE mobileNumber = ?`, [req.query.mobileNumber], (err, rows) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ error: 'Failed to search for students.' });
    }

    res.json(rows);
  });
});



  app.put('/api/students/:id', (req, res) => {
    const { name, mobileNumber } = req.body;
    
    db.run(`UPDATE students SET name = ?, mobileNumber = ? WHERE id = ?`, [name, mobileNumber, req.params.id], function(err) {
      if (err) {
        return console.log(err.message);
      }
  
      res.send({ changes: this.changes });
    });
  });
  
  app.delete('/api/student/:id', (req, res) => {
    db.run(`DELETE FROM students WHERE id = ?`, [req.params.id], function(err) {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: 'Failed to delete student.' });
      }
  
      if (this.changes > 0) {
        res.json({ success: 'Student deleted successfully.', changes: this.changes });
      } else {
        res.status(404).json({ error: 'Student not found.' });
      }
    });
  });
  

  

// Start the server
// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
