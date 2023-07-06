const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//student routes
const studentRoutes = require('./routes/student_routes.js');
app.use(studentRoutes);

// class routes
const classRoutes = require('./routes/class_routes.js');
app.use(classRoutes);

// trainer routes
// const trainerRoutes = require('./routes/trainer_routes.js');
// app.use(trainerRoutes);

// auth routes
const authRoutes = require('./routes/auth_routes.js');
app.use(authRoutes);

// schools routes
const schoolRoutes = require('./routes/school_routes.js');
app.use(schoolRoutes);

// const { createTrainerTable } = require('./database/trainer_db_actions.js');

app.get('/', (req, res) => {
  // res.render('students/list');
  res.redirect('/students');
});

const photoRoutes = require('./routes/photo_routes.js');
app.use(photoRoutes);

// Start the server
// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
