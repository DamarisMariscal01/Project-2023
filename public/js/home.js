const saludo = document.querySelector('.saludo');

window.onload = () => {
    if(!sessionStorage.nombre){
        location.href = '/login';
    } else{
        saludo.innerHTML = `Hola ${sessionStorage.nombre}`;
    }
}

const logOut = document.querySelector('.logout');

logOut.onclick = () => {
    sessionStorage.clear();
    location.reload();
}