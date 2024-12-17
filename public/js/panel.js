///// ELEMENTOS
// Botones
const upload_btn = document.querySelector(".upload_btn");
const storage_btn = document.querySelector(".storage_btn");
const user_btn = document.querySelector(".user_btn");
const logoff_btn = document.querySelector(".logoff_btn");
// Extras
const domain = String(window.location);
const base_domain = domain.split("/").slice(0, -1).join("/") + "/";

///// EVENTOS
logoff_btn.addEventListener("click", Logoff);

///// FUNCIONES
async function Logoff() {
    const peticion = await fetch(`${base_domain}login`, { method: "DELETE" });

    const resultado = (peticion.ok) ? await peticion.json() : null

    if(resultado.status == "OK") window.location.reload();
}