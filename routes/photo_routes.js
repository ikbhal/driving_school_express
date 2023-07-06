

// router 
const express = require('express');
const {db} = require('../database/db.js');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const router = express.Router();

const multer = require('multer');

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const uniqueId = uuid.v4();
        // get file extension from file.orginalname
        const fileExtension = file.originalname.split('.')[1];
        const fullFullName = file.fieldname + '-' + uniqueId + "." + fileExtension
        console.log("file file name:", fullFullName)
        cb(null, fullFullName);
    }
});

const upload = multer({ storage });

// test photo upload form route , its handling 
router.get('/upload', (req, res) => {
    res.render('upload');

});

router.post('/upload', upload.single('photo'), (req, res) => {
    // Get the uploaded file
    const photo = req.file;
    console.log("photo:", photo);
    res.send('Photo uploaded successfully');
});

router.get('/students/:id/upload', (req, res) => {
    const id = req.params.id;
    console.log("id:", id);
    res.render('student_upload', { id: id });
});

router.post('/students/:id/upload', upload.single('photo'), (req, res) => {
    const photo = req.file;
    const id = req.params.id;
    console.log("upload photo to studnet id:"  + id);
    console.log("photo:", photo);
    const query = `UPDATE students SET photo = '${photo.filename}' WHERE id = ${id}`;
    db.run(query, (err, result) => {
        if (err) {
            console.log("err:", err);
            res.send(err);
        }   else {
            console.log("result:", result);
            res.send("photo uploaded , student path updated  for student id: " + id)
        }
    });
});

// Define the route to delete a photo by file name
router.get('/delete-photo', (req, res) => {
    const fileName = req.query.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlinkSync(filePath);
        res.json({ message: 'Photo deleted successfully' });
    } else {
        res.status(404).json({ error: 'Photo not found' });
    }
});

// access photo
// D:\git_tauqeer\driving_school_express\skool.db
// http://localhost:3000/uploads/photo-e958b90a-c539-4b8b-8397-d5e26d108ac6.jpg
router.get('/uploads/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'uploads', fileName);
    console.log("filePath:", filePath);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.send("file not found");
    }
});

//<a href="/students/<%= student.id %>/delete_photo" class="btn btn-danger">Delete Photo</a>
router.get('/students/:id/delete_photo', (req, res) => {
    const id = req.params.id;
    console.log("id:", id);

    // fetch student photo from db, then delete file from uploads folder
    const query = `SELECT photo FROM students WHERE id = ${id}`;
    db.get(query, (err, result) => {
        if (err) {
            console.log("err:", err);
            res.send("unable to delete photo as student not found");
        } else {
            console.log("result:", result);
            const fileName = result.photo;
            const filePath = path.join(__dirname, '..', 'uploads', fileName);

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // Delete the file
                fs.unlinkSync(filePath);
                console.log('Photo deleted successfully' + " for student id: " + id);
                // update the studnet photo to null
                const query = `UPDATE students SET photo = null WHERE id = ${id}`;
                db.run(query, (err, result) => {
                    if(err){
                        console.err("uanble to update photo to null , err:", err);
                        res.send("unable to update student photo to null")
                    }else {
                        res.send("photo deleted and student photo updated to null");
                    }
                });
            } else {
                console.log('Photo not found');
            }
        }
    });
});

module.exports = router;