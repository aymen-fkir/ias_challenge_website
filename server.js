const path = require("path")
const express = require('express');
const app = express();
const fs = require("fs").promises;
const bodyParser = require('body-parser');
const mysql = require('mysql');


const { connect } = require("http2");
const html_file = path.join(__dirname,"public","login")
const Login_file = path.join(__dirname,"public","login","index.html")
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public","login")));
app.use(express.static(path.join(__dirname, "public",)));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


async function create_connection() {
    try {
        const secret = await fs.readFile(path.join(__dirname, "connection.json"), 'utf8');
        return mysql.createConnection(JSON.parse(secret));
    } catch (error) {
        console.error('Error reading connection file:', error.message);
        throw error;
    }
}

function close_connection(connection) {
    connection.end((endErr) => {
        if (endErr) {
            console.error('Error closing connection:', endErr);
            return;
        }
        console.log('Connection closed');
    });
}

function insert_into_db(data) {
    const connection = create_connection();
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }

        connection.query('INSERT INTO users SET ?', data, (insertErr, results) => {
            if (insertErr) {
                console.error('Error inserting data:', insertErr);
                // Handle error as needed
            } else {
                console.log('Data inserted successfully:', results);
            }

            // Close the connection after the query is executed
            close_connection(connection);
        });
    });
}

  

function select_from_db(Query, callback) {
    create_connection().then((connection) => {
        connection.query(Query, (selectErr, results) => {
            close_connection(connection);
            if (selectErr) {
                callback(selectErr, null);
            } else {
                callback(null, results);
            }
        });
    }).catch((error) => {
        // Handle errors during connection creation
        console.error('Error creating connection:', error.message);
    });
}


app.get('/', (req, res) => {
    res.render(Login_file);
});

app.post('/submit',(req,res)=>{
    select_from_db("select * from users where email = '" + req.body.email + "'",(err,data)=>{
        if (err){
            res.status(500).send("Internal server Error")
        }
        else{
                
            if (data[0].email == req.body.email && data[0].password == req.body.password) {
                select_from_db("select * from robot_data where id = '" + data[0].id + "'",(Err,Data)=>{
                    if (Err){
                        res.status(500).send("Internal server Error")
                    }
                    else{
                        select_from_db("select * from weather_data where project_id = '" + data[0].project_id + "'",(ERR,DATA)=>{
                            if (ERR){
                                res.status(500).send("Internal server Error")
                            }
                            else{
                                res.render("index",{Data,DATA})
                            }
                        })
                    }
                })
                    
            }
            else{
                res.redirect("/")
            }
        }

        }
    )

})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


