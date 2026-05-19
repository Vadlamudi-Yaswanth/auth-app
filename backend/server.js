const http=require("http");
const express=require("express");
const cors=require("cors");
const bcrypt = require("bcrypt");
const app=express();
const db = require("./db");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.post("/api/register", (req, res) => {
  const { fullname, email, password } = req.body

  // Hash password before saving
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if(err) return res.json({ message: "Something went wrong" })

    const query = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)"
    
    db.query(query, [fullname, email, hashedPassword], (err, result) => {
      if(err){
        console.log("Error:", err)
        return res.json({ message: "Registration failed!" })
      }
      res.json({ message: "Registration successful!" })
    })
  })
});
app.post("/api/login", (req, res) => {
  const { email, password } = req.body
    const emailQuery = "SELECT * FROM users WHERE email = ?"
    db.query(emailQuery, [email], (err, results) => {
        if(err) return res.json({ message: "Something went wrong" })
        if(results.length === 0) return res.json({ message: "User not found!" })

        const user = results[0]
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) return res.json({ message: "Something went wrong" })
            if(isMatch) {
                const token=jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" })
                res.json({ message: "Login successful!" })
            } else {
                res.json({ message: "Invalid credentials!" })
            }
        })
    })
});
const server=http.createServer(app);
const PORT=process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
