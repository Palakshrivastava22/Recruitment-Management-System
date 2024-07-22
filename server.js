const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Database Setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gargi',
  database: 'recruitment_system',
  port: '3306',
});

connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });
  
  // Middleware to parse JSON
  app.use(express.json());
  
  // Define routes
  app.get('/', (req, res) => {
    res.send('Server is running');
  });
  
  // Example route to fetch students
  app.get('/students', (req, res) => {
    connection.query('SELECT * FROM students', (err, results) => {
      if (err) {
        console.error('Error fetching students: ' + err.stack);
        res.status(500).send('Database query failed');
        return;
      }
      res.json(results);
    });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
// Basic Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(400).send('User not found');
    
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) throw err;
      if (!match) return res.status(400).send('Invalid credentials');
      
      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
      res.json({ token });
    });
  });
});

app.post('/students', authenticateToken, (req, res) => {
  const { name, enrollment, contact, email, gender, city, state, tenth_marks, twelfth_marks } = req.body;
  db.query('INSERT INTO students (name, enrollment, contact, email, gender, city, state, tenth_marks, twelfth_marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, enrollment, contact, email, gender, city, state, tenth_marks, twelfth_marks], (err, results) => {
    if (err) throw err;
    res.status(201).send('Student added');
  });
});

app.get('/students', authenticateToken, (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/placement-drives', authenticateToken, (req, res) => {
  const { company_name, job_role, eligibility_criteria, date } = req.body;
  db.query('INSERT INTO placement_drives (company_name, job_role, eligibility_criteria, date) VALUES (?, ?, ?, ?)', [company_name, job_role, eligibility_criteria, date], (err, results) => {
    if (err) throw err;
    res.status(201).send('Placement drive added');
  });
});

app.get('/placement-drives', authenticateToken, (req, res) => {
  db.query('SELECT * FROM placement_drives', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
