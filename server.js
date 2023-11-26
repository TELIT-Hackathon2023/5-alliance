const express = require('express');
const ejs = require('ejs');
const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');

config = JSON.parse(fs.readFileSync("config.json").toString());

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const server = http.createServer(app);

app.use("/WebPage", express.static(__dirname + "/WebPage"));

//Connect to MySQL Server
const conn = mysql.createConnection({
    host: 'parking-patrik-0978.a.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_hkWeyVpMkWsO2W5KuMo',
    database: 'defaultdb',
    port: '20274',
    // Add this line to specify the authentication plugin
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from('AVNS_hkWeyVpMkWsO2W5KuMo'),
    },
});
conn.connect( (err) => {
    if (err) throw err;
    console.log("MySQL connected.. database: " + config.mysql.database);
});

// function for load users to array users = [{},{}]; 
function loadUsers(){
    conn.query(`SELECT * FROM users`, (err, result) => {
        if (err) throw err;
        //global.users = [];
        global.users = [];
        for (i=0; i<result.length; i++) {
            // set users
            users.push(result[i]);
        }
        console.log(global.users)
    });
};
loadUsers();

// server listen
server.listen(port, () => {
    console.log("app is listening.. on port", port);
});

// login page
app.get('/', (req, res) => {
    console.log("login page");
    res.render('login');
});

// check login values
app.post('/', (req, res) => {
    console.log("login check");
    var username = req.body.username;
    var password = req.body.password;
    var founded = false;
    if(username != "" && password != ""){
        for(i=0; i<global.users.length; i++){
            if(username === global.users[i].name && password === global.users[i].password){
                founded = true;
                var id = global.users[i].id;
                res.render('parking', { id : id });
                break;
            }
        }
        if( !founded ){
            res.render('login');
            console.log('wrong pass/name');
        }
    }
});

// profile show
app.post('/profile', (req, res) => {
    var id = req.body.profileBtn;
    console.log(id);
    var user = global.users[id - 1];
    res.render("profile", { user: user, id: id });
});

// edit form in profile
app.post('/editSpz', (req, res) => {
    var id = req.body.editBtn;
    var spz = req.body.spz;
    conn.query(`UPDATE users SET spz = '${spz}' WHERE id = ${id}`, (err) => {
        if (err) throw err;
        loadUsers();
    });
    console.log(global.users);
    
    setTimeout(() => {
        var user = global.users[id - 1];
        res.render('profile', {user: user, id: id});
    }, 500);
    
});

// main page
app.post('/homeBtn', (req, res) => {
    var id = req.body.homeBtn;
    res.render('parking', { id: id });
});