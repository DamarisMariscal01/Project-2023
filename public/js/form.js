// animación para login (al principio)

// busca a todos los child elements con la clase ".form" y los almacena en un arreglo
const form = [...document.querySelector('.form').children];

// para cada elemento, dentro de 100 milisegundos, le va a dar a los elementos opacidad de 1
form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i*100);
})

window.onload = () => {
    if(sessionStorage.name){
        location.href = '/';
    }
}

// validación datos
const nombre = document.querySelector('.nombre') || null;
const email = document.querySelector('.email');
const pass = document.querySelector('.pass');
const submit = document.querySelector('.submit');
// const submitRegister = document.querySelector('.submitRegister');

if(nombre == null){ //cuando la pagina de login esté abierta
    submit.addEventListener('click', () => {
        fetch('/login-user',{
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                email: email.value,
                pass: pass.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
    })
} else{ //cuando register esté abierto
    submit.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                nombre: nombre.value,
                email: email.value,
                pass: pass.value                
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
    })
}

const validateData = (data) => {
    if(!data.nombre){
        alertBox(data);
    } else{
        sessionStorage.nombre = data.nombre;
        sessionStorage.email = data.email;
        location.href = '/';
    }
}

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}