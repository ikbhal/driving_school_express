const { db } = require('./db.js');

async function createTables() {
  try {
    await runQuery(`CREATE TABLE IF NOT EXISTS students (
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
    );`);

    await runQuery(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        trainer_id INTEGER,
        date DATE,
        time_start TEXT,
        time_end TEXT
    );`);

    // Add more create table queries here if needed

    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err.message);
  }
}

async function dropTables() {
  try {
    await runQuery(`DROP TABLE IF EXISTS students;`);
    await runQuery(`DROP TABLE IF EXISTS classes;`);

    // Add more drop table queries here if needed

    console.log('Tables dropped successfully');
  } catch (err) {
    console.error('Error dropping tables:', err.message);
  }
}

function runQuery(query) {
  return new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { createTables, dropTables };
