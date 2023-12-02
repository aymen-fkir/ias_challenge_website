const path = require("path")
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { connect } = require("http2");
const html_file = path.join(__dirname,"public","login")
const Login_file = path.join(__dirname,"public","login","index.html")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public","login")));
app.use(express.static(path.join(__dirname, "public",)));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

function create_connection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'aymen147',
        database: 'my_db'
    });
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

  

function select_from_db(Query,callback){
    const connection = create_connection();
    connection.query(Query, (selectErr,results) =>{
        close_connection(connection);
        if (selectErr){
            callback(selectErr, null);
        } else {
            callback(null, results)
            return results;
            
        }
        
        
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
                        res.render("index",{Data})
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


