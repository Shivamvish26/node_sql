const express = require("express");
const app = express();
const con = require("./config.js");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

app.use(express.json());
app.use(cors());

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

app.post("/users_contact", (req, resp) => {
  const data = req.body;

  con.query("INSERT INTO users SET ?", data, (err, result, fields) => {
    if (err) {
      console.error("Error inserting data:", err);
      return resp.status(500).send("Database insert error");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "shivam906026@gmail.com",
      to: data.email,
      subject: "Thanks for contacting us!",
      text: `Hi ${data.name},\n\nThank you for reaching out to us. We’ll get back to you shortly!\n\nBest,\nYour Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(200).send({
          message: "Form submitted, but failed to send confirmation email.",
        });
      } else {
        console.log("Email sent: " + info.response);
        return resp.send({
          message: "Form submitted and confirmation email sent.",
          userId: result.insertId,
        });
      }
    });
  });
});

// PUT API CODE
app.put("/update_user/:id", (req, resp) => {
  const data = [req.body.name, req.body.email, req.params.id];
  con.query(
    "UPDATE Users SET name = ?, email = ? where id = ?",
    data,
    (err, result) => {
      if (err) throw err;
      resp.send(result);
    }
  );
});

// DELETE API
app.delete("/delete_user/:id", (req, resp) => {
  const id = req.params.id;
  con.query("DELETE FROM Users WHERE id = ?", id, (err, result) => {
    if (err) throw err;
    resp.send(result);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
