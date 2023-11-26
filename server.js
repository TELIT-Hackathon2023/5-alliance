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

function loadArea_1(){
    conn.query(`SELECT * FROM area_1`, (err, result) => {
        if (err) throw err;
        //global.area_1 = [];
        global.area_1 = [];
        for (i=0; i<result.length; i++) {
            // set areas
            area_1.push(result[i]);
        }
        console.log(global.area_1)
    });
};
loadArea_1();

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
    if(username != ""){
        for(i=0; i<global.users.length; i++){
            if(username === config.username && password === config.password){
                founded = true;
                res.render('admin');
                break;
            } else if(username == global.users[i].name && global.users[i].password == null){
                founded = true;
                var id = global.users[i].id;
                console.log("1");
                res.render('pswset', { id: id });
                break;
            } else if(username === global.users[i].name && password === global.users[i].password){
                founded = true;
                var id = global.users[i].id;
                var user = global.users[id - 1];
                res.render('parking', { id: id, user: user });
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
    var user = global.users[id - 1];
    res.render('parking', { id: id, user: user });
});

app.post('/addUser', (req, res) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var tel = req.body.tel;
    var email = req.body.email;
    var pid = req.body.pid;
    var ecv = req.body.ecv;
    conn.query(`INSERT INTO users (name, surname, email, phone_num, spz, pid) VALUES('${fname}','${lname}','${email}','${tel}','${ecv}','${pid}')`, (err) => {
        if(err) throw err;
        console.log('user created');
        conn.query(`ALTER TABLE users AUTO_INCREMENT = 1;`, (err) => {
            if (err) throw err;
            loadUsers();
            setTimeout(() => {
                res.render('admin');
            },500);
        });
    });
});

app.post('/setPsw', (req, res) => {
    var psw = req.body.password;
    var id = req.body.pswBtn;
    conn.query(`UPDATE users SET password = '${psw}' WHERE id = ${id}`, (err) => {
        if (err) throw err;
        console.log('psw set!');
        loadUsers();
        setTimeout(() => {
            var user = global.users[id - 1];
            res.render('parking', { id: id, user: user });
        }, 300)
    });
});

app.post('/booking', (req, res) => {
    var from = req.body.timeFrom;
    var to = req.body.timeTo;
    
});

app.post('/updateParkingSpot', (req, res) => {
    const id = req.body.spotId;
    // Process the selected spot on the server as needed
    console.log('Selected spot:', id);
    conn.query(`UPDATE area_1 SET occupied_from = '${from}', occupied_to = '${to}',  WHERE id = ${id}`, (err) => {
        if(err)throw err;
    });
    res.json(global.area_1);
});