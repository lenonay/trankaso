export function ValidatePasswd(passwd) {
    // Creamos las regex
    const min = /[a-z]/;
    const mayus = /[A-Z]/;
    const num = /[0-9]/;
    const simb = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/;

    // Iniciamos un array
    let validaciones = [];

    // Metemos los resultados de las validaciones
    validaciones.push(min.test(passwd));
    validaciones.push(mayus.test(passwd));
    validaciones.push(num.test(passwd));
    validaciones.push(simb.test(passwd));

    // Si todas son true devolvemos true, si no false
    if (validaciones.every(entry => entry)) {
        return true;
    } else {
        return false;
    }
}