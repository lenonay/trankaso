///// ELEMENTOS
// Botones
const upload_btn = document.querySelector(".upload_btn");
const storage_btn = document.querySelector(".storage_btn");
const user_btn = document.querySelector(".user_btn");
const logoff_btn = document.querySelector(".logoff_btn");
// Elementos
const main = document.querySelector("main")
const aside = document.querySelector("aside");
// Extras
const domain = String(window.location);
const base_domain = domain.split("/").slice(0, -1).join("/") + "/";

///// EVENTOS
logoff_btn.addEventListener("click", Logoff);
upload_btn.addEventListener("click", HandleUpload);

///// FUNCIONES
async function Logoff() {
    const peticion = await fetch(`${base_domain}login`, { method: "DELETE" });

    const resultado = (peticion.ok) ? await peticion.json() : null

    if (resultado.status == "OK") window.location.reload();
}

async function HandleUpload(event) {
    // 1. Crear display y fondo y meterle la clase custom
    CreateDisplay("upload")
    // 2.1 Pedimos la lista de juegos al servidor
    const juegos_pet = await fetch(`${domain}/games`, { method: "GET" });

    const juegos_res = (juegos_pet.ok) ? await juegos_pet.json() : null;

    const juegos = (juegos_res.game_names.length > 0)
        ? juegos_res.game_names.map(juego => `<option value="${juego}">${juego}</option>`).join("")
        : ""
        ;
    // 2.2 Rellenar el display con los elementos
    const html = `
        <h2>Subida de clips y capturas</h2>
        <div class="error_display"></div>
        <div class="formulario">
            <div class="upload_form">
                <label for="game">
                    <p>
                        Seleccione el juego del que quiere subir archivos,
                        si está el que quiere seleccione la opcion <span>otro</span>
                        para seleccionarlo
                    </p>
                    <select name="game" id="game_inp">
                        <option value="-" selected disabled>-</option>
                        <option value="otro">Otro</option>
                        ${juegos}
                    </select>
                </label>
                <label for="game_name" class="game_name hidden">
                    <p>Escriba el nombre del juego que desea añadir</p>
                    <input type="text" name="game_name" id="game_name_inp"/>
                </label>
                <button type="button" class="confirm_btn">
                    <span>Confirmar y subir</span>
                </button>
            </div>
            <div class="upload_zone hidden">
                <div class="drop_area">
                    <h3>Arrestre los archivos aqui</h3>
                    <span>O</span>
                    <button type="button" class="files_btn">
                        <span>Subir archivos</span>
                    </button>
                    <input type="file" name="files_inp" multiple hidden/>
                </div>
            </div>
        </div>
    `;
    const display = document.querySelector(".display");
    display.innerHTML = html;
    // Recuperamos los elementos
    const $game = display.querySelector("#game_inp");
    const $files = display.querySelector("#files_inp");
    const confirm_btn = display.querySelector(".confirm_btn");
    const files_btn = display.querySelector(".files_btn");
    const upload_zone = display.querySelector(".upload_zone");
    const drop_area = display.querySelector(".drop_area");
    // 3. Escuchar eventos
    $game.addEventListener("change", ToggleCustomGame);
    confirm_btn.addEventListener("click", ConfirmGameName)
    // 4. Enviar peticion de subida    
}

async function ConfirmGameName(event) {
    // 1. Verificar si hay que crear el nombre del juego
    const $game = document.querySelector("#game_inp");
    const $game_name = document.querySelector("#game_name_inp");

    // 1.1 Si deja el nombre vacío mostrar un error
    if ($game.value == "otro" && !$game_name.value) {
        ShowDisplayErrors("Ingrese un nombre válido");
        return;
    }
    // 1.2 2Mandar la peticion post para crearlo
    if ($game.value == "otro") {
        // Mandamos la petición para crear el recurso
        const create_pet = await fetch(`${domain}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: $game_name.value })
        });

        // Recuperamos la respuesta
        const create_res = (create_pet.ok) ? await create_pet.json() : null;

        // Si hubo un error lo mostramos
        if(create_res.status !== "OK"){
            ShowDisplayErrors(create_res.error);
            return;
        }
    }
    // 2. Validar si el nombre se puede usar
    // 3. Mostrar El menu de subida o un error si precisa.
}

function ToggleCustomGame(event) {
    const game_name = document.querySelector(".game_name");
    const { value } = event.target;

    if (value === "otro") {
        game_name.classList.remove("hidden");
    } else {
        game_name.classList.add("hidden");
    }
}

function ShowDisplayErrors(msg) {
    // Recuperamos el display de errores
    const error_display = document.querySelector(".error_display");

    // Mostramos el error
    error_display.innerHTML = `<p>${msg}</p>`;
}

function CreateDisplay(customClass) {
    // Cerramos los antiguos
    CloseDisplay();

    const newDisplay = document.createElement("div");
    const newBack = document.createElement("div");

    newDisplay.className = "display"
    newDisplay.classList.add(customClass);

    newBack.className = "back";

    aside.append(newBack);
    aside.append(newDisplay);

    newBack.addEventListener("click", CloseDisplay);
}

function CloseDisplay() {
    // Recuperamos los antiguos si existían
    const oldDisplay = document.querySelector(".display");
    const oldBack = document.querySelector(".back");

    // Si existian los borramos
    if (oldDisplay) oldDisplay.remove();
    if (oldBack) oldBack.remove();
}