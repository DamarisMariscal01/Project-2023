const express = require("express"); // para concectar con el servidor
const path = require("path"); // para facilitar acceder a mis archivos
const bodyParser = require("body-parser"); // para enviar y recibir datos
const knex = require("knex"); // para acceder a la db
const session = require("express-session"); // para manejar y guardar datos específicos de los users
const shortid = require('shortid'); // para generar links en el upload

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

app.use(
  session({
    secret: "secret-key", // Cambia "secret-key" por una clave secreta de tu elección
    resave: false,
    saveUninitialized: true,
  })
);

// para ver el nombre
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// initialPath tiene la ruta predeterminada y estática
let initialPath = path.resolve(__dirname);

app.use(express.static(initialPath));

// esto es para mandar archivos desde server.js
app.get("/home", (req, res) => {
  res.sendFile(path.join(initialPath, "principal.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(initialPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(initialPath, "register.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(); // Destruye la sesión actual
  res.redirect("/login"); // Redirige al usuario a la página de inicio de sesión
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(initialPath, "notes.html"));
});

app.get("/archivos", (req, res) => {
  res.sendFile(path.join(initialPath, "archivos.html"));
});

app.get("/flashcards", (req, res) => {
  res.sendFile(path.join(initialPath, "flashcards.html"));
});

// poner flashcards del usuario cuando das reload
app.get("/flashcards-data", (req, res) => {
  const userId = req.session.userId;

  db.select("front_fc", "back_fc")
    .from("project-2023.flashcards")
    .where("id_user", userId)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error al obtener los flashcards de la base de datos:", error);
      res.status(500).json({ error: "Error al obtener los flashcards de la base de datos" });
    });
});

// poner notas del usuario cuando das reload
app.get('/user-notes', (req, res) => {
  const userId = req.session.userId; // Obtiene el ID del usuario de la sesión

  // Obtener las notas del usuario desde la base de datos
  db.select('text_note')
    .from('project-2023.notes')
    .where('id_user', userId)
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => {
      console.error('Error al obtener las notas del usuario:', error);
      res.status(500).json({ error: 'Error al obtener las notas del usuario' });
    });
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
          res.json("Bienvenid@");
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
  db.select("id_user", "name_user", "mail_user")
    .from("project-2023.user")
    .where({
      mail_user: email,
      pass_user: pass,
    })
    .then((data) => {
      if (data.length) {
        // almacena el "id_user" y "name_user" en la sesión
        req.session.userId = data[0].id_user;
        req.session.nombre = data[0].name_user;
        res.json("Bienvenid@" + req.session.nombre);
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

app.post('/save-flashcard', (req, res) => {
  const { question, answer } = req.body;
  const userId = req.session.userId; // Obtiene el ID del usuario de la sesión

  // guardar la flashcard en la base de datos
  db("project-2023.flashcards")
    .insert({ 
      id_user: userId, // depende de la sesión en la que estemos, la fc se va a guardar en el id de ese usuario
      front_fc: question, 
      back_fc: answer 
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error al guardar la flashcard en la base de datos:', error);
      res.sendStatus(500);
    });
});

app.post('/save-notes', (req, res) => {
  const { note } = req.body;
  const userId = req.session.userId; // Obtiene el ID del usuario de la sesión

  // guardar la flashcard en la base de datos
  db("project-2023.notes")
    .insert({ 
      id_user: userId, // depende de la sesión en la que estemos, la fc se va a guardar en el id de ese usuario
      text_note: note, 
    })
    .then(() => {
      res.json({ success: true }); // Envia una respuesta JSON
    })
    .catch((error) => {
      console.error('Error al guardar la nota en la base de datos:', error);
      res.status(500).json({ success: false, error: 'Error al guardar la nota en la base de datos' }); // Envia una respuesta JSON en caso de error
    });
});

app.get('/notes', (req, res) => {
  const userId = req.session.userId; // Obtiene el ID del usuario de la sesión

  db("project-2023.notes")
    .where("user_id", userId) // Filtra las notas por el ID del usuario actual
    .select()
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => {
      console.error('Error al obtener las notas del usuario:', error);
      res.status(500).json({ error: 'Error al obtener las notas del usuario' });
    });
});


// para saber el puerto en el que estamos viendo la pag
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});