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
// Iconos
const svgs = {
    trash: (x = 40) => { return `<svg width="${x}px" height="${x}px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.6117 12.3094C10.3225 12.0128 9.84769 12.0068 9.55111 12.296C9.25453 12.5852 9.24852 13.06 9.53769 13.3566L10.6117 12.3094ZM11.163 15.0236C11.4522 15.3202 11.927 15.3262 12.2236 15.037C12.5202 14.7478 12.5262 14.273 12.237 13.9764L11.163 15.0236ZM9.53769 15.6434C9.24852 15.94 9.25453 16.4148 9.55111 16.704C9.84769 16.9932 10.3225 16.9872 10.6117 16.6906L9.53769 15.6434ZM12.237 15.0236C12.5262 14.727 12.5202 14.2522 12.2236 13.963C11.927 13.6738 11.4522 13.6798 11.163 13.9764L12.237 15.0236ZM13.8623 13.3566C14.1515 13.06 14.1455 12.5852 13.8489 12.296C13.5523 12.0068 13.0775 12.0128 12.7883 12.3094L13.8623 13.3566ZM11.163 13.9764C10.8738 14.273 10.8799 14.7478 11.1764 15.037C11.473 15.3262 11.9478 15.3202 12.237 15.0236L11.163 13.9764ZM12.7883 16.6906C13.0775 16.9872 13.5523 16.9932 13.8489 16.704C14.1455 16.4148 14.1515 15.94 13.8623 15.6434L12.7883 16.6906ZM12.237 13.9764C11.9478 13.6798 11.473 13.6738 11.1764 13.963C10.8799 14.2522 10.8738 14.727 11.163 15.0236L12.237 13.9764ZM13.418 6.25C13.8322 6.25 14.168 5.91421 14.168 5.5C14.168 5.08579 13.8322 4.75 13.418 4.75V6.25ZM10.1683 4.75C9.75407 4.75 9.41829 5.08579 9.41829 5.5C9.41829 5.91421 9.75407 6.25 10.1683 6.25V4.75ZM16.575 8.25C16.9892 8.25 17.325 7.91421 17.325 7.5C17.325 7.08579 16.9892 6.75 16.575 6.75V8.25ZM6.82501 6.75C6.4108 6.75 6.07501 7.08579 6.07501 7.5C6.07501 7.91421 6.4108 8.25 6.82501 8.25V6.75ZM7.53894 18.7678L7.00194 19.2913L7.00194 19.2913L7.53894 18.7678ZM6.82501 17H7.57501H6.82501ZM9.53769 13.3566L11.163 15.0236L12.237 13.9764L10.6117 12.3094L9.53769 13.3566ZM10.6117 16.6906L12.237 15.0236L11.163 13.9764L9.53769 15.6434L10.6117 16.6906ZM12.7883 12.3094L11.163 13.9764L12.237 15.0236L13.8623 13.3566L12.7883 12.3094ZM13.8623 15.6434L12.237 13.9764L11.163 15.0236L12.7883 16.6906L13.8623 15.6434ZM13.418 4.75H10.1683V6.25H13.418V4.75ZM16.575 6.75H6.82501V8.25H16.575V6.75ZM7.63719 10.25H15.7628V8.75H7.63719V10.25ZM15.7628 10.25C15.7739 10.25 15.7864 10.2535 15.8001 10.2676C15.8142 10.2819 15.825 10.3037 15.825 10.333H17.325C17.325 9.47675 16.6434 8.75 15.7628 8.75V10.25ZM15.825 10.333V17H17.325V10.333H15.825ZM15.825 17C15.825 17.9845 15.0517 18.75 14.1375 18.75V20.25C15.9157 20.25 17.325 18.7769 17.325 17H15.825ZM14.1375 18.75H9.26251V20.25H14.1375V18.75ZM9.26251 18.75C8.82117 18.75 8.39395 18.5704 8.07594 18.2442L7.00194 19.2913C7.59816 19.9029 8.41092 20.25 9.26251 20.25V18.75ZM8.07594 18.2442C7.7573 17.9174 7.57501 17.4702 7.57501 17H6.07501C6.07501 17.8559 6.40634 18.6805 7.00194 19.2913L8.07594 18.2442ZM7.57501 17V10.333H6.07501V17H7.57501ZM7.57501 10.333C7.57501 10.3037 7.58587 10.2819 7.59989 10.2676C7.61359 10.2535 7.62614 10.25 7.63719 10.25V8.75C6.75664 8.75 6.07501 9.47675 6.07501 10.333H7.57501Z" fill="currentColor"></path> </g></svg>` }
}

///// EVENTOS
logoff_btn.addEventListener("click", Logoff);
upload_btn.addEventListener("click", HandleUpload);
storage_btn.addEventListener("click", HandleStorage);

///// FUNCIONES
async function Logoff() {
    const peticion = await fetch(`${base_domain}login`, { method: "DELETE" });

    const resultado = (peticion.ok) ? await peticion.json() : null

    if (resultado.status == "OK") window.location.reload();
}

async function HandleStorage() {
    // Creamos los elementos
    const filter_div = document.createElement("div");
    const files_div = document.createElement("div");

    // Añadimos las clases
    filter_div.className = "filters"
    files_div.className = "files"

    // Añadimos los elementos al main
    main.append(filter_div);
    main.append(files_div);

    // Obtenemos los archivos
    const Allfiles = await GetAllFiles({});

    // Mostramos los ficheros
    ShowFiles(Allfiles);
}

function ShowFiles(_files) {
    const files_div = document.querySelector(".files");

    for (const file of _files.files) {
        // Creamos el elemento
        const card = document.createElement("div");
        card.className = "file_card";

        // Sacamos el tipo principal
        const mainType = file.type.split("/")[0];

        card.innerHTML = `
            <img d_game="${file.game}" d_type="${mainType}" src="${file.thumbnail}" alt="${file.name} thumbnail" />
            <div class="buttons">
                <button type="button" class="delete_btn">
                    ${svgs.trash()}
                </button>
            </div>
        `;

        files_div.append(card);

        const img = card.querySelector("img");
        const del_btn = card.querySelector(".delete_btn");

        img.addEventListener("click", ShowMedia);
        del_btn.addEventListener("click", DeleteFile);
    }
}



function ShowMedia(event) {
    console.log(event.target);
}

function DeleteFile(event) {
    console.log(event.currentTarget);
}

async function GetAllFiles(filter) {
    const params = new URLSearchParams();

    if (filter.games) params.append("games", filter.games);
    if (filter.date) params.append("date", filter.date);
    if (filter.author) params.append("author", filter.author);
    if (filter.type) params.append("type", filter.type);

    const query = params.toString();

    const peticion = await fetch(`${domain}/files?${query}`);

    const respuesta = (peticion.ok) ? await peticion.json() : null;

    return respuesta;
}

async function GetFilesFilters() {
    // Pedimos los filtros al servidor
    const peticion = await fetch(`${domain}/files/filters`);

    // Si conseguimos respuesta la devolvemos sino no nulo
    const resultado = (peticion.ok) ? await peticion.json() : null

    // Devolvemos el resultado
    return resultado;
}

async function HandleUpload() {
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
                    <h3>Arrastre los archivos aqui</h3>
                    <span>O</span>
                    <button type="button" class="files_btn">
                        <span>Subir archivos</span>
                    </button>
                    <input type="file" id="files_inp" name="files_inp" multiple hidden/>
                </div>
                <div class="uploaded_files"></div>
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
    const drop_area = display.querySelector(".drop_area");
    // 3. Escuchar eventos
    $game.addEventListener("change", ToggleCustomGame);
    confirm_btn.addEventListener("click", ConfirmGameName);
    files_btn.addEventListener("click", () => $files.click());
    $files.addEventListener("change", HandleFilesInput);
    // Drag and Drop
    drop_area.addEventListener("dragover", HandleDragOver);
    drop_area.addEventListener("dragleave", HandleDragLeave);
    drop_area.addEventListener("drop", HandleDrop);
    // 4. Enviar peticion de subida
}

function HandleDragOver(event) {
    event.preventDefault();

    const { currentTarget } = event

    // Añadimos la clase activa
    currentTarget.classList.add("active");

    // Cambiamos el texto
    currentTarget.querySelector("h3").textContent = "Suelte los archivos aquí";
}

function HandleDragLeave(event) {
    event.preventDefault();

    const { currentTarget } = event

    // Añadimos la clase activa
    currentTarget.classList.remove("active");

    // Cambiamos el texto
    currentTarget.querySelector("h3").textContent = "Arrastre los archivos aquí";
}

function HandleDrop(event) {
    event.preventDefault();

    // Quitamos el texto
    const { currentTarget } = event;
    // Añadimos la clase activa
    currentTarget.classList.remove("active");
    // Cambiamos el texto
    currentTarget.querySelector("h3").textContent = "Arrastre los archivos aquí";

    const { files } = event.dataTransfer;

    for (const file of files) {
        ProcessFile(file)
    }
}

async function HandleFilesInput(event) {
    const { files } = event.target;

    for (const file of files) {
        await ProcessFile(file);
    }
}

async function ProcessFile(_file) {
    // Validar el tipo mime
    const { type, name } = _file;
    // Extensiones validas
    const validTypes = ["image", "video"];

    // Obtenemos el tipo principal
    const mainType = type.split("/")[0];

    // Si no es valido mostramos error y salimos
    if (!validTypes.includes(mainType)) {
        ShowDisplayErrors("Solo se permite videos o imágenes");
        return;
    }
    // Recuperamos la zona de ficheros subidos
    const zone = document.querySelector(".uploaded_files");

    // Activamos la zona de ficheros subidos
    zone.classList.add("active");

    // Creamos la card
    const card = document.createElement("div");

    // Le asignamos la clase
    card.className = "file_card";

    // Creamos el contenido de la carta
    card.innerHTML = `
        <span>${name}</span>
        <div class="loader"></div>
    `;

    // Añadimos el html
    zone.append(card);

    const form = new FormData;

    form.append("file", _file);

    // Subimos el archivo
    const upload_pet = await fetch(`${domain}/files`, {
        method: "POST",
        body: form
    });

    const upload_res = (upload_pet.ok) ? await upload_pet.json() : null;

    const loader = card.querySelector(".loader");

    if (upload_res.status !== "OK") {
        // Marcamos el archivo como fallido
        loader.className = "xmark";
        // En caso de que no haya error ponemos uno genérico
        let error = upload_res.error ?? "Error al subir el archivo";
        // Mostramos el error y salimos
        ShowDisplayErrors(error);
        return;
    }

    loader.className = "check";
}

async function ConfirmGameName() {
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
        if (create_res.status !== "OK") {
            ShowDisplayErrors(create_res.error);
            return;
        }

        // Creamos una opción con ese nombre
        const option = document.createElement("option");
        option.value = $game_name.value;
        option.textContent = $game_name.value;

        // Lo añadimos al menu
        $game.append(option);

        // Lo seleccionamos
        $game.value = $game_name.value;
    }
    // 2. Validar si el nombre se puede usar
    const validar_pet = await fetch(`${domain}/games`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: $game.value })
    })

    const validar_res = (validar_pet.ok) ? await validar_pet.json() : null;

    // 3. Mostrar El menu de subida o un error si precisa.
    if (validar_res.status !== "OK") {
        ShowDisplayErrors(validar_res.error);
        return
    }

    const game_name = document.querySelector(".game_name");
    game_name.classList.add("hidden");

    const upload_zone = document.querySelector(".upload_zone");
    upload_zone.classList.remove("hidden");
}

function ToggleCustomGame(event) {
    const game_name = document.querySelector(".game_name");
    const game_name_inp = document.querySelector("#game_name_inp");
    const { value } = event.target;

    // Reiniciamos el valor del selector
    game_name_inp.value = "";

    if (value === "otro") {
        game_name.classList.remove("hidden");
    } else {
        game_name.classList.add("hidden");
    }

    // Borramos los archivos subidos y ocultamos los archivos
    const uploaded_files = document.querySelector(".uploaded_files");
    uploaded_files.innerHTML = "";
    uploaded_files.classList.remove("active");

    // Ocultamos la zona de subidas
    const upload_zone = document.querySelector(".upload_zone");
    upload_zone.classList.add("hidden");
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
    const oldAlert = document.querySelector(".alert");

    // Si existian los borramos
    if (oldDisplay) oldDisplay.remove();
    if (oldBack) oldBack.remove();
    if (oldAlert) oldAlert.remove();
}

function CreateAlert() {
    // Creamos la alerta
    const alert = document.createElement("div");
    alert.className = "alert"

    // Creamos el fondo
    const newBack = document.createElement("div");
    newBack.className = "back";    
    
    alert.innerHTML = `
        <h3>¡Aviso!</h3>
        <p>Esta acción no se puede revertir, ¿está seguro de seguir?</p>
        <div class="buttons">
            <button class="confirm_btn" type="button">
                <span>Continuar</span>
            </button>
            <button class="cancel_btn" type="button">
                <span>Cancelar</span>
            </button>
        </div>
    `;

    // Añadimos la alerta y el fondo
    main.append(alert);
    main.append(newBack);

    newBack.addEventListener("click", CloseDisplay);
    
    const cancel_btn = alert.querySelector("cancel_btn");
    cancel_btn.addEventListener("click", CloseDisplay);

}

/////// Cuerpo
HandleStorage();