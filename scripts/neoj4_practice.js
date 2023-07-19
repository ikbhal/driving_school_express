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

// Create a dummy school and connect relationships with students and trainers
const createDummySchool = async () => {
  const result = await session.run(
    `
    CREATE (s:School {id: $id, name: $name})
    WITH s
    MATCH (st:Student {id: $studentId}), (tr:Trainer {id: $trainerId})
    CREATE (s)<-[:JOINED]-(st)
    CREATE (s)<-[:WORKS_AT]-(tr)
    RETURN s
    `,
    { id: 1, name: 'ABC School', studentId: 1, trainerId: 1 }
  );
  console.log('Created dummy school:', result.records[0].get('s').properties);
};

// Create a dummy class and connect relationships with students, trainers, and school
const createDummyClass = async (studentId, trainerId, schoolId) => {
  const result = await session.run(
    `
    MATCH (st:Student {id: $studentId}), (tr:Trainer {id: $trainerId}), (sc:School {id: $schoolId})
    CREATE (c:Class {id: $classId, class_date: $classDate, start_time: $startTime, end_time: $endTime})
    CREATE (c)<-[:TAKEN_FROM]-(st)
    CREATE (c)<-[:TAUGHT_BY]-(tr)
    CREATE (c)<-[:OFFERED_BY]-(sc)
    RETURN c
    `,
    {
      classId: 1,
      classDate: '2023-07-19',
      startTime: '09:00',
      endTime: '11:00',
      studentId,
      trainerId,
      schoolId
    }
  );
  console.log('Created dummy class:', result.records[0].get('c').properties);
};

// Call the functions to create the dummy data
createDummyStudent()
  .then(() => createDummyTrainer())
  .then(() => createDummySchool())
  .then(() => createDummyClass(1, 1, 1))
  .then(() => session.close())
  .then(() => driver.close())
  .catch((error) => console.error('Error:', error));
