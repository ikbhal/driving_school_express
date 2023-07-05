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
const studentRoutes = require('./routes/studentroutes.js');
app.use(studentRoutes);

// class routes
const classRoutes = require('./routes/class_routes.js');
app.use(classRoutes);

// trainer routes
const trainerRoutes = require('./routes/trainer_routes.js');
app.use(trainerRoutes);

const { createTrainerTable } = require('./database/trainer_db_actions.js');
createTrainerTable((err) => {
  if (err) {
    console.log("error in creating table trainers errr:", err)
  } else {
    console.log('succesfully created table trainers');
  }
});

app.get('/', (req, res) => {
  res.render('/students/list');
});

// Start the server
// const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
