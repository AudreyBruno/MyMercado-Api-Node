import auth from "basic-auth";

function BasicAuth(req, res, next){
    const user = auth(req);
    const username = 'audrey';
    const password = '123456';

    if(user && user.name.toLocaleLowerCase() === username.toLocaleLowerCase() && user.pass === password){
        next();
    } else {
        res.status(401).send("Acesso negado");
    }
};

export default BasicAuth;