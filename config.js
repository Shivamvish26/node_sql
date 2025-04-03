const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_db",
});

con.connect((err) => {
  if (err) {
    console.log("Error connecting to the database: ", err);
    return;
  } else {
    console.log("Connected to the database");
  }
});

module.exports = con;