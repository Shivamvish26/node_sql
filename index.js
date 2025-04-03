const express = require("express");
const app = express();
const con = require("./config.js");
app.use(express.json());

// GET API CODE
app.get("/", (req, resp) => {
  con.query("select * from users", (err, result) => {
    if (err) {
      console.log(err);
      resp.send("Error in getting data");
    } else {
      resp.send(result);
    }
  });
});

// POST API CODE
// fields is not required in this case, but it is used in get aipi code to get the fields of the table
app.post("/", (req, resp) => {
  const data = req.body;
  con.query("INSERT INTO users SET ?", data, (err, result, fields) => {
    if (err) {
      console.error("Error inserting data:", err);
      return resp.status(500).send("Database insert error");
    }
    resp.send({ message: "User added successfully", userId: result.insertId });
  });
});

// PUT API CODE
app.put("/",(req,resp) => {
  resp.send("PUT API CODE");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
