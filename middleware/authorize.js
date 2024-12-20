export function authorize(req, res, next) {
    // Si no hay sesión un 401
    if(!req.session){
        res.status(401).send();
        return
    }

    next();
}