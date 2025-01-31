import fs from "node:fs";
import path from "node:path";

export function getFormatedSize(path) {
    // Obtenemos el peso en bytes
    const sizeBytes = getSize(path);

    // Devolvemos el peso formateado
    return formatSize(sizeBytes);
}

function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getSize(path) {
    // Sacamos la info del fichero
    const stats = fs.lstatSync(path);

    // Si es un directorio
    if (stats.isDirectory()) {
        // Lo mandamos a una función recursiva
        return getDirectorySize(path);
    } else {
        // Si es un archivo devolvemos su peso
        return stats.size;
    }
}

function getDirectorySize(dirPath) {
    // Leemos el contenido del archivo
    const files = fs.readdirSync(dirPath);
    // Iniciamos el contador de bytes
    let totalSize = 0;

    files.forEach(file => {
        // Creamos la ruta
        const filePath = path.join(dirPath, file);

        // Leemos el archivo
        const stats = fs.lstatSync(filePath);

        if (stats.isDirectory()) {
            // Si es un directorio hacemos recursividad
            totalSize += getDirectorySize(filePath);
        } else {
            totalSize += stats.size;
        }
    });

    return totalSize;
}