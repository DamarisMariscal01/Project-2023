const express = require("express"); // para concectar con el servidor
const path = require("path"); // para facilitar acceder a mis archivos
const bodyParser = require("body-parser"); // para enviar y recibir datos
const knex = require("knex"); // para acceder a la db
const session = require("express-session");

// datos para acceder a la db
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

app.use(session({
  secret: "secret-key", // Cambia "secret-key" por una clave secreta de tu elección
  resave: false,
  saveUninitialized: true
}));

// initialPath tiene la ruta predeterminada y estática
let initialPath = path.resolve(__dirname);

app.use(express.static(initialPath));

// esto es para mandar archivos desde server.js
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
  // si no llena todos los datos, aparece ese msj
  if (!nombre || !email || !pass) {
    res.json("Es necesario llenar todos los datos");
  } else {
    // si pone un email que ya existe, se lo advierte
    db.select()
      .from("project-2023.user")
      .where("mail_user", email)
      .then((data) => {
        if (data.length > 0) {
          res.json("Este email ya existe");
        } else {
          // si no existe ese email, se guardan los datos en la db y le aparece un msj
          return db("project-2023.user")
            .insert({
              name_user: nombre,
              mail_user: email,
              pass_user: pass,
            })
            .returning(["name_user", "mail_user"]);
        }
      })
      .then((data) => {
        if (data) {
          res.json("Registro correcto, bienvenid@");
        }
      })
      .catch((err) => {
        console.error("Error al insertar los datos:", err);
        res.status(500).json({ error: "Error al insertar los datos" });
      });
  }
});


app.post("/login-user", (req, res) => {
  const { email, pass } = req.body;

  // va a la db y selecciona el email y pass del usuario
  db.select("name_user", "mail_user")
    .from("project-2023.user")
    .where({
      mail_user: email,
      pass_user: pass,
    })
    .then((data) => {
      if (data.length) {
        // si encuentra los datos, le dice este msj:
        req.session.nombre = data[0].name_user; // Establece la variable de sesión "nombre"
        res.json("Bienvenid@");
      } else {
        // si no encuentra los datos ó no se han llenado, aparece esto:
        res.json("Hay algún dato incorrecto");
      }
    })
    .catch((err) => {
      console.error("Error al obtener los datos:", err);
      res.status(500).json({ error: "Error al obtener los datos" });
    });
});

// para saver el puerto en el que estamos viendo la pag
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});