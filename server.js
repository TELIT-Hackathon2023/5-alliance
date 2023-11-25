const express = require('express');
const ejs = require('ejs');
const http = require('http');
const mysql = require('mysql');
const fs = require('fs');

config = JSON.parse(fs.readFileSync("config.json").toString());

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const server = http.createServer(app);

// // Connect to MySQL Server
// const conn = mysql.createConnection(config.mysql);
// conn.connect( (err) => {
//     if (err) throw err;
//     console.log("MySQL connected.. database: " + config.mysql.database);
// });

// server listen
server.listen(port, () => {
    console.log("app is listening.. on port", port);
});

// login page
app.get('/', (req, res) => {
    console.log("login page");
    res.render('login');
});

app.post('/', (req, res) => {
    console.log("ano");
    res.render('index');
    // login verification
});

