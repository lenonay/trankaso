import fs from "node:fs";
import mime from "mime";

import { DEF_USER } from "../config.js";

export function LocalFileInclusion(){
    // Ruta de la boveda
    const vault = "./vault/";
    
    // Recuperamos todos los juegos que hay sin meter el temporal
    const games = fs.readdirSync(vault).filter(entry => entry !== "tmp");
    
    // Inicializamos un array
    let allGames = [];
    
    // Iteramos por cada carpeta de juego
    games.forEach(game => {
        // Iniciamos el objeto
        const gameDB = {};
        
        // Guardamos todos los datos de los juegos.
        gameDB.name = game;
        gameDB.author = DEF_USER;
        gameDB.path = vault + `${game}/`;
        gameDB.thumbpath = vault + `${game}/.thumbnails/`;
        gameDB.files = [];
        
        // Obtenemos todos los ficheros subidos y sacamos el directorio de thumbnails
        const gameFiles = fs.readdirSync(gameDB.path).filter(entry => entry !== ".thumbnails");
        
        // Recuperamos todos los thumbnails
        const allThumbnails = fs.readdirSync(gameDB.thumbpath);
        
        // Iteramos por cada fichero
        gameFiles.forEach(file => {
            // Creamos el objeto
            const fileDB = {};
            
            // Cargamos los datos
            fileDB.name = file;
            fileDB.game = gameDB.name;
            fileDB.path = gameDB.path + fileDB.name;
            fileDB.author = gameDB.author;
            
            // Leemos el archivo para sacar datos
            const stats = fs.statSync(fileDB.path);
            
            // Montamos el peso
            fileDB.size = (stats.size / 1024 / 1024).toFixed(2)
            
            // Metemos la fecha en ISO
            fileDB.date = new Date(stats.ctimeMs);
            
            // Metemos el tipo mime
            fileDB.type = mime.getType(fileDB.path);
            
            //// Guardamos el thumbnail
            // Sacamos el nombre sin extensión
            const file_without_ext = file.split(".").slice(0,-1).join(".");
            
            const file_thumb = allThumbnails.find(thumb => thumb.includes(file_without_ext));

            console.log(file_thumb);

            // Montamos la ruta completa
            fileDB.thumbnail = gameDB.thumbpath + file_thumb;
            
            // Metemos el fichero al array de ficheros del juego en el que estamos
            gameDB.files.push(fileDB);
        });
        
        // Metemos el juego al array de juegos
        allGames.push(gameDB);
    });

    // Devolvemos el JSON con todos los datos
    return allGames;
}