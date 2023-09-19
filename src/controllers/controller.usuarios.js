import { Router } from "express";
import db from "../config/database.js";

const controllerUsuarios = Router();

controllerUsuarios.post("/usuarios/login", function(request, response){        
    let ssql = "SELECT id_usuario, nome, email, endereco, bairro, cidade, uf, cep, "
    ssql += "date_format(dt_cadastro, '%d/%m/%Y %H:%i:%s') as dt_cadastro ";
    ssql += "FROM usuario WHERE email=? and senha=?";

    db.query(ssql, [request.body.email, request.body.senha], function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(result.length > 0 ? 200 : 401).json(result[0]);
        }
    });
});

controllerUsuarios.post("/usuarios/cadastro", function(request, response){        
    let ssql = "INSERT INTO usuario(nome, email, senha, endereco, bairro, cidade, uf, cep, dt_cadastro) "
    ssql += "VALUES(?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())";

    db.query(ssql, [request.body.nome, 
                    request.body.email,
                    request.body.senha,
                    request.body.endereco,
                    request.body.bairro,
                    request.body.cidade,
                    request.body.uf,
                    request.body.cep], function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(201).json({id_usuario: result.insertId});
        }
    });
});

controllerUsuarios.get("/usuarios/:id_usuario", function(request, response){    
    
    let ssql = "SELECT * FROM usuario WHERE id_usuario = ?";

    db.query(ssql, [request.params.id_usuario], function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(result.length > 0 ? 200 : 404).json(result[0]);
        }
    });
});

controllerUsuarios.put("/usuarios/:id_usuario", function(request, response){    
    
    let ssql = "UPDATE usuario SET nome=?, email=?, senha=?, endereco=?, bairro=?, ";
    ssql += "cidade=?, uf=?, cep=? where id_usuario=?";

    db.query(ssql, [request.body.nome, 
                    request.body.email,
                    request.body.senha,
                    request.body.endereco,
                    request.body.bairro,
                    request.body.cidade,
                    request.body.uf,
                    request.body.cep,
                    request.params.id_usuario], function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {
            return response.status(200).json({id_usuario: request.params.id_usuario});
        }
    });
});

controllerUsuarios.get("/usuarios/:id_usuario/pedidos", function(request, response){ 
    let filtro = [];     
    let ssql = "SELECT * FROM pedido WHERE id_usuario = ?";

    filtro.push(request.params.id_usuario);

    if (request.query.id_pedido) {
        ssql += " AND id_pedido = ?";
        filtro.push(request.query.id_pedido);
    }

    db.query(ssql, filtro, function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(result.length > 0 ? 200 : 404).json(result);
        }
    });
});

export default controllerUsuarios;