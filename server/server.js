const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Use middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use sessions for tracking login state
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: false
}));

// Create a MySQL connection
const connection = mysql.createConnection({
  host: '147.232.158.198',
  user: 'root',
  password: '',
  database: 'parking'
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Routes

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username is already taken using a database query
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert a new user into the database with the hashed password
    await insertUser(username, hashedPassword);

    res.status(200).send('Registration successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists using a database query
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    // Verify the password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password');
    }

    // Set the session to indicate that the user is logged in
    req.session.loggedInUser = user;

    res.status(200).send('Login successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Helper function to get user by username
function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// Helper function to insert a new user
function insertUser(username, password) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Logout endpoint
app.post('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy();

  res.status(200).send('Logout successful');
});

// Check if the user is logged in
app.get('/check-login', (req, res) => {
  if (req.session.loggedInUser) {
    res.status(200).send(`Logged in as ${req.session.loggedInUser.username}`);
  } else {
    res.status(401).send('Not logged in');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});