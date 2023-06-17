const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "polo",
    database: "postgres",
    schema: "project-2023",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let initialPath = path.resolve(__dirname);

app.use(express.static(initialPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(initialPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(initialPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(initialPath, "register.html"));
});

app.post("/register-user", (req, res) => {
  const { nombre, email, pass } = req.body;

  if (!nombre || !email || !pass) {
    res.json("Es necesario llenar todos los datos");
  } else {
    db("project-2023.user")
      .insert({
        name_user: nombre,
        mail_user: email,
        pass_user: pass,
      })
      .returning(["name_user", "mail_user"])
      .then((data) => {
        res.json("Registro correcto, bienvenid@");
        location.href = '/';
      })
      // .then(data => {
      //   res.sendFile(path.join(initialPath, 'index.html'));
      // })
      .catch((err) => {
        if (err.detail.includes("Ya existen estos datos")) {
          res.json("Este email ya existe");
        } else {
          console.error("Error al insertar los datos:", err);
          res.status(500).json({ error: "Error al insertar los datos" });
        }
      });
  }
});

app.post("/login-user", (req, res) => {
  const { email, pass } = req.body;

  db.select("name_user", "mail_user")
    .from("project-2023.user")
    .where({
      mail_user: email,
      pass_user: pass,
    })
    .then((data) => {
      // if (data.length) {
      //   // res.json('Bienvenid@');
      //   res.sendFile(path.join(initialPath, 'index.html'));
      // } else {
      //   res.json('Hay algún dato incorrecto');
      // }
      if (data.length) {
        res.json("Bienvenid@");
        location.href = '/';
      } else {
        res.json("Hay algún dato incorrecto");
      }
    })
    .catch((err) => {
      console.error("Error al obtener los datos:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
