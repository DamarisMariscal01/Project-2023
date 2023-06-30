// busca a todos los child elements con la clase ".form" y los almacena en un arreglo
const form = [...document.querySelector(".form").children];

// animación para que los elementos aparezcan de uno en uno
form.forEach((item, i) => {
  setTimeout(() => {
    item.style.opacity = 1;
  }, i * 100);
});

// verifica si hay un valor almacenado en la variable de sesión "nombre" con sessionStorage, si hay algo ahí, redirecciona a '/'
window.onload = () => {
  if (sessionStorage.email) {
    location.href = "/home";
  }
};

// obtiene referencias a los elementos del form
const nombre = document.querySelector(".nombre") || null;
const email = document.querySelector(".email");
const pass = document.querySelector(".pass");
const submit = document.querySelector(".submit");

if (nombre == null) {
  // cuando la página de login esté abierta
  submit.addEventListener("click", () => {
    fetch("/login-user", {
      method: "post", // en el server.js se necesita
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        // se convierten en datos JSON
        email: email.value,
        pass: pass.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        validateData(data);
      });
  });
} else {
  // cuando register esté abierto
  submit.addEventListener("click", () => {
    fetch("/register-user", {
      method: "post", // en el server.js se necesita
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        // se convierten en datos JSON
        nombre: nombre.value,
        email: email.value,
        pass: pass.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        validateData(data);
      });
  });
}

const validateData = (data) => {
  if (!data) {
    alertBox(data);
  } 
  else if (data.includes("Bienvenid@")) {
    alertBox("entre");
    window.location.href = "/home";   
  }
};

// los msjs del res.json se van acá
const alertBox = (data) => {
  const alertContainer = document.querySelector(".alert-box");
  const alertMsg = document.querySelector(".alert");
  alertMsg.innerHTML = data;

  alertContainer.style.top = `5%`;
  setTimeout(() => {
    alertContainer.style.top = null;
  }, 5000);
};
