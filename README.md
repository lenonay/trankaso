# Propósito de la APP
Esta app fue diseña con la idea de tener un sitio donde poder subir clips, fotos, gif, etc. Sin la limitación de peso de los archivos de app sociales como *Discord*.

Requiere de tener una buena cantidad de almacenamiento disponible y reservada para esta app

## Requerimientos
Una vez clonado el repositiorio, se tienen que preparar algunos ficheros y configuraciónes para conseguir el correcto funcionamiento.

### Node
Se requiere la siguiente versión de node o superior: **22.12.0**, ya que se utiliza el método nativo de Node para cargar el fichero con variables de entorno.

```javascript
    process.loadEnvFile('./.env');
```

### Dependecias
Además de Node se requiere tener instalados en el equipo dos paquetes adicionales:
- **imagemagick**: Para crear las miniaturas.
- **ffmpeg**: Sacar el primer frame de los videos para crear la miniatura.

Para instalarlos en un sistema basado en debian:
```bash
    sudo apt install imagemagick ffmpeg -y
```

### Enlace simbólico
Se necesita crear un enlace simbólico al directorio donde se desea guardar los archivos. Es recomendable crear un volumen lógico para poder aumentar el tamaño de manera progresiva en caso de necesitarlo, y montarlo en una ruta externa.

**Muy importante**. El enlace simbólico debe llevar el siguiente nombre: *vault*.

### Variables de Entorno
En la raíz del directorio de trabajo se debe crear un fichero .env (*Importante que se nombre de esta forma*). Debe contener las siguientes variables:
- **PORT**: Puerto donde la aplicación escucha.
- **INT**: Interfaz de red donde la aplicación escucha.
- **JWT_PASS**: Contraseña extremadamente fuerte, puesto que es la usada para generar los JWT.
- **DEF_USER**: El nombre de usuario por defecto que se creará
- **SALT**: Salt usada para el cifrado de contraseñas con *bcrypt*.
- **TMP_DIR**: Directorio temporal dentro de *vault*, usado para crear las minaturas.Importante que sea un ruta relativa. Ejemplo: "./vault/tmp".

### NPM/YARN
Luego queda instalar las dependecias, en caso de utilizar el gestor NPM:
```bash
    npm i
```

Si utilizas yarn:
```bash
    yarn
```
***

## Funcionamiento
Cuando la app se ejecute por primera vez incializará la base de datos local. Añadirá el usario por defecto. Al acceder mediante el navegador se nos presentará el panel de login. Colocando las credenciales básicas, tendremos acceso al panel

Dentro del panel tenemos dos zonas diferenciadas, la parte izquierda del panel contiene los botones de acción; mientras que en la parte derecha se muestra el contenido de la sección actual.

### Subir contenido
Para poder subir un medio, por ejemplo una imagen. Debemos hacer click en el primer boton de acción disponible.

Nos aparecerá un menú emergente, tendremos que seleccionar el juego del que queramos subir el medio. En caso de que no esté presente el juego que nosotros queremos, podemos seleccionar la opcion *otro*. Y nos aparecerá un campo donde podemos escribir el nombre

Una vez seleccionado el juego, le damos click a *Confirmar y subir*. Y nos aparecerá una zona donde soltar los archivos. Se pueden subir multiples archivos de una sola vez. Una vez se confirme la subida aparecerá un *tick* al lado del nombre. En caso de que haya un error saldrá una X, y un mensaje de error en la parte superior.

Cuando cerremos el menú haciendo click en cualquier zona externa, se recargará la seccion actual.

### Ver contenido
El segundo botón, que es la sección cargada por defecto. Aparecen ordenados de la siguiente forma: agrupados por el mismo juego, ordenados de mas antiguo a más reciente.

#### Filtros
Se puede filtrar por tres filtros principales (*Falta añadir filtros por antigüedad y fecha*): Juegos, Usuarios, Tipo. Se puede agrupar todos los filtros para realizar diferentes combinaciones, en caso de que no haya contenido, se mostrará un mensaje. Se pueden resetear los filtros mediante el botón situado a la derecha.

#### Display
Cada medio, tiene un boton para eliminarlo con su pertinente confirmación. Y en caso de que se haga click sobre la imagen, se creará un menu emergente.

En este nuevo menú tendremos la imagen a resolución completa, un botón de descargar y uno para eliminarlo.

### Eden
Apartado en proceso, aquí solo podrán acceder determinados usuarios. Estará el contenido reservado.

### Usuarios
En esta sección podremos cambiar la contraseña de nuestro usuario y crear usuarios nuevos y eliminarlos.

Cualquiera puede crear un usuario nuevo, se introduce el nombre del nuevo usuario y se crea una contraseña temporal. Cuando un usuario es creado registra quién lo creó, esto es debido a que los usuarios que no son administradores, solo pueden eliminar los usuarios que ellos hayan creado. Por otro lado, el administrador puede eliminar cualquier usuario

### Opciones
Sección en proceso, aqui se podrá gestionar los juegos que hayan, revisar el almacenamiento consumido, entre otros.


## Desarollo
Este es el registro del desarollo

### Problemas conocidos
Los problemas conocidos que aun no han sido solucionados son los siguientes

#### Imágenes demasiado largas
Cuando una imagen es demasiado larga, por ejemplo una captura de pantalla de movil, causa problemas porque sobresale del menu del Display.

Seguramente la causa sea el CSS.

### Proximas utilidades
Proximas features que vendrán a la aplicación

#### Menú de ajustes - Prio Alta
Se necesita un menu de ajustes donde se pueda ver los juegos creados, poder borrarlos solo si se tiene privilegio de admin. Y poder ver el peso en el directorio vault.

Seguramente haga que se use alguna dependecia o manejar la salida del comando `du -h -d 1 ./vault`

#### Función de archivado - Prio Baja
Sería ideal poder archivar clips o juegos completos, sobretodo para los que estén muy vistos y se ideal guardarlos.