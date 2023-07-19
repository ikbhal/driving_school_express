const {db} = require('./db.js');

function createSchool(school,
    callback){
    const {name, address, school_mobile_number, 
        owner_name, owner_email, 
        owner_mobile_number, password
    } = school;
    console.log('create school');
    const query = `
        INSERT INTO schools 
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
                callback(err, null);
            }else {
                const insertedId = this.lastID;
                console.log('Inserted row ID:', insertedId);
                getSchoolById(insertedId, callback);
            }
        }
    );
}

function getSchoolById(id, callback) {
    console.log('get school by id');
    db.get(`SELECT * FROM school WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.log(err.message);
            // send error response
            return callback(err, null);
        }
        // send json resposne with row
        callback(null, row);
    });
}

module.exports = {
    createSchool,
    getSchoolById
};