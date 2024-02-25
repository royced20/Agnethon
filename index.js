import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Agnethon",
  password: "admin",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

app.get("/login.ejs", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("login.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.Email;
  const password = req.body.password;
  const name=req.body.name;
  const age= req.body.age;
  const roles=req.body.role;
  

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      const result = await db.query(
        "INSERT INTO users (name, email,password,roles,age) VALUES ($1, $2,$3,$4,$5)",
        [name,email,password,roles,age]
      );
      console.log(result);
      res.render("login.ejs");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.Email;
  const name= req.body.name;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        const storedrole=user.roles;
        if(storedrole=="teacher"){
        
        res.render("teachers.ejs");
        }
        else{
          res.render("student.ejs");
        }
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }

  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
