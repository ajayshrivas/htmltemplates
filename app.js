const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();
const mysql = require('mysql');
const port = 8000;
app.use(cors());
//app.use(express.json());
// Add middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // You may also want to enable JSON parsing
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_db',
}); 
// Connect to the database
dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
}); 
// Set up the storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
})
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

//Define a route for uploading images
app.post('/upload', upload.single('image'), (req, res) => {
    const { selectedGender, selectedValue,hobbies } = req.body;
  if (!req.file) {  
    return res.status(400).send('No file uploaded.');
  } 
 const imageUrl = `/uploads/${req.file.filename}`;
  if(imageUrl){

    const insertQuery = 'INSERT INTO np_user (f_name, l_name) VALUES (?, ?)';
    const values = [selectedGender, selectedValue];

    dbConnection.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return;
      }
      console.log('Data inserted successfully');
    });

     res.status(200).json({'status':true,'images_url':imageUrl,'message':'Success' }); 
  }else{
    res.status(200).json({'status':false,'images_url':imageUrl,'message':'Faild !'}); 
  }
});

app.post('/reg',(req, res)=>{ 
    console.log(req.body);
    res.status(200).json('this is testing');
});
app.post('/reg', (req, res) => {
  const formData = req.body; // Form data from the request body
  console.log(formData); // Log the received form data for debugging
  res.json({ message: 'Form data received', data: formData });
});
app.get('/test_api', (req, res) => {
    res.json('API Server is working!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});