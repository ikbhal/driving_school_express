const neo4j = require('neo4j-driver');

// Create a Neo4j driver instance
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

// Create a session to execute Cypher queries
const session = driver.session();

// Create a dummy student
const createDummyStudent = async () => {
  const result = await session.run(
    'CREATE (s:Student {id: $id, name: $name, mobile_number: $mobileNumber}) RETURN s',
    { id: 1, name: 'Alice Smith', mobileNumber: '5551234567' }
  );
  console.log('Created dummy student:', result.records[0].get('s').properties);
};

// Create a dummy trainer
const createDummyTrainer = async () => {
  const result = await session.run(
    'CREATE (t:Trainer {id: $id, name: $name, mobile_number: $mobileNumber}) RETURN t',
    { id: 1, name: 'John Doe', mobileNumber: '1234567890' }
  );
  console.log('Created dummy trainer:', result.records[0].get('t').properties);
};

// Create a class taken by the student from the trainer
const createDummyClass = async (studentId, trainerId) => {
  const result = await session.run(
    `
    MATCH (s:Student {id: $studentId}), (t:Trainer {id: $trainerId})
    CREATE (c:Class {id: $classId, class_date: $classDate, start_time: $startTime, end_time: $endTime})
    CREATE (s)-[:TAKEN_FROM]->(c)
    CREATE (c)-[:TAUGHT_BY]->(t)
    RETURN c
    `,
    {
      classId: 1,
      classDate: '2023-07-19',
      startTime: '09:00',
      endTime: '11:00',
      studentId,
      trainerId
    }
  );
  console.log('Created dummy class:', result.records[0].get('c').properties);
};

// Call the functions to create the dummy data
createDummyStudent()
  .then(() => createDummyTrainer())
  .then(() => createDummyClass(1, 1))
  .then(() => session.close())
  .then(() => driver.close())
  .catch((error) => console.error('Error:', error));
