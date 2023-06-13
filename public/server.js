const express = require('express'); //crear servidor
const path = require('path'); //ayuda a saber la localización de archivos css, js y html
const bodyParser = require('body-parser'); //para enviar y recibir datos de la db
const knex = require('knex'); //con ello tenemos acceso a la db

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'poloKenai',
        database: 'postgres'
    }
})

const app = express();

// let initialPath = path.join(__dirname, "public");

let initialPath = path.join(__dirname);

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

app.get('/login', (req, res) =>{
    res.sendFile(path.join(initialPath, "login.html"));
})

app.get('/register', (req, res) =>{
    res.sendFile(path.join(initialPath, "register.html"));
})


//Insertar datos a db
app.post('/register-user', (req, res) => {
    const { nombre, email, pass } = req.body;

    if(!nombre.length || !email.length || !pass.length){
        res.json('Es necesario lenar todos los datos');
    } else{
        db("project-2023.user").insert({
            nombre: nombre,
            email: email,
            pass: pass
        })
        .returning(["nombre", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('Ya existen estos datos')) {
                res.json('Este email ya existe');
            }
        })
    }
})

app.post('/login-user', (req, res) => {
    const { email, pass } = req.body;

    db.select('nombre', 'email')
    .from('user')
    .where({
        email: email,
        pass: pass
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('Hay algún dato incorrecto');
        }
    })
})


app.listen(3000, (req, res) => {
    console.log('Listening on port 3000')
})