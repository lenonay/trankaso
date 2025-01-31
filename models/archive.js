import fs from "node:fs";
import { execSync } from "node:child_process";

export class Archives {
    static file(_data) {
        const { path } = _data;

        // Si ya está comprimido salimos con error
        if (path.split(".").pop() == "bz2") {
            return { status: "error", error: "El archivo ya está comprimido" };
        }

        try {
            // Intentamos comprimir el archivo
            execSync(`bzip2 '${path}'`)

            // Devolvemos un estado exitoso 
            return {
                status: "OK",
                new_path: path + ".bz2",
            }
        }
        catch { return { status: "error", error: "Error al comprimir el archivo" } }

    }

    static unarchive_file(_data) {
        // Sacamos el path de la DB
        const { path } = _data;

        if (path.split(".").pop() !== "bz2") {
            return { status: "error", error: "El fichero no esta comprimido" }
        }

        try {
            // Descomprimimos el archivo
            execSync(`bunzip2 '${path}'`)

            return {
                status: "OK",
                new_path: path.split(".").slice(0, -1).join(".")
            }

        } catch { return { status: "error", error: "Error al descomprimir el archivo" } };
    }

    static unarchive_game(_data) {
        // Sacamos el path
        const { path, name } = _data;

        // Revisamos que este archivado
        if (!/\.bz2$/.test(path)) {
            return { status: "error", error: "El juego no está archivado" }
        }

        // Creamos el nuevo path
        const new_path = `./vault/${name}`;

        try {
            // Extramos el juego
            execSync(`tar -xjf '${path}' -C ./vault`);
            // Borramos el tarball
            fs.unlinkSync(path);

            // Devolvemos el nuevo path y el estado del archivo
            return { status: "OK", new_path, archived: false }
        } catch {
            return { status: "error", error: "No se pudo extraer el juego" }
        }
    }

    static archive_game(_data) {
        // Sacamos el path
        const { path, name } = _data;

        // Revisamos que no este archivado
        if (/\.bz2$/.test(path)) {
            // Devolvemos error
            return { status: "error", error: "El juego ya está archivado" }
        }

        // Creamos el nuevo path
        const new_path = `./vault/.${name}.tar.bz2`;

        try {
            // Creamos el tarball y borramos el archivo
            execSync(`tar --remove-files -cjf '${new_path}' -C vault '${name}'`);

            // Devolvemos el nuevo path y el estado del archivo
            return { status: "OK", new_path, archived: true }
        } catch {
            // Devolvemos error si falla algo
            return { status: "error", error: "No se pudo comprimir el juego" }
        }
    }
}