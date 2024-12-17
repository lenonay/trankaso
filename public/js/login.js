///// ELEMENTOS
// form
const main = document.querySelector("main");
const $user = document.querySelector("#user_inp");
const $passwd = document.querySelector("#passwd_inp");
// Boton
const login_btn = document.querySelector(".login_btn");
// Extras
const domain = window.location;
//// EVENTOS
login_btn.addEventListener("click", HandleLogin);

$user.addEventListener("keydown", NextInput);

$passwd.addEventListener("keydown", SendForm);

//// FUNCIONES
function NextInput(event){
    // Si se presiona enter pasamos al campo de contraseña
    if(event.key === 'Enter'){
        $passwd.focus();
    }
}

function SendForm(event){
    // Si se presiona enter enviamos el form
    if(event.key === 'Enter'){
        login_btn.click();
    }
}

async function HandleLogin(event) {
    // Creamos el JSON
    const body = {
        user: $user.value,
        passwd: $passwd.value
    }

    // Motamos la peticion
    const peticion = await fetch(`${domain}login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const resultado = (peticion.ok) ? await peticion.json() : null;

    if (resultado.status !== "OK") {
        ShowError(resultado.error);
        return;
    };

    // redirigimos si salio bien
    window.location = "/panel";
}

function ShowError(error) {
    // Recuperamos el elemento del error
    const error_el = document.querySelector(".error");

    // Si hay un error lo borramos
    if (error_el) error_el.remove();

    // Creamos el p
    const p = document.createElement("p");
    p.className = "error";
    p.textContent = error;

    main.insertAdjacentElement("afterbegin",p);
}