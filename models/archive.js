import { exec } from "node:child_process";

export class Archives {
    static async file(_data) {
        const { path } = _data;

        // Si ya está comprimido salimos con error
        if (path.split(".").pop() == "bz2") {
            return { status: "error", error: "El archivo ya está comprimido" };
        }

        try {
            exec(`bzip2 '${path}'`, (error) => { if (error) console.log(error) })

            // Devolvemos un estado exitoso 
            return {
                status: "OK",
                new_path: path + ".bz2",
            }
        }
        catch (e) { return { status: "error", error: e } }

    }

    static async unarchive_file(_data) {
        // Sacamos el path de la DB
        const { path } = _data;

        if (path.split(".").pop() !== "bz2") {
            return { status: "error", error: "El fichero no esta comprimido" }
        }

        try {
            // Descomprimimos el archivo
            exec(`bunzip2 '${path}'`)

            return {
                status: "OK",
                new_path: path.split(".").slice(0,-1).join(".")
            }

        } catch { return { status: "error", error: e } };
    }
}