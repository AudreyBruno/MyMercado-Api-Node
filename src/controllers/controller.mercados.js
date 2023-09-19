import { Router } from "express";
import db from "../config/database.js";

const controllerMercados = Router();

controllerMercados.get("/mercados/:id_mercado", function(request, response){
    let ssql = "SELECT * FROM mercado WHERE id_mercado = ?";

    db.query(ssql, [request.params.id_mercado], function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(200).json(result);
        }
    });
});

controllerMercados.get("/mercados", function(request, response){
    let filtro = [];     
    let ssql = "SELECT * FROM mercado";
    ssql += " WHERE id_mercado > 0";

    if (request.query.busca) {
        ssql += " AND nome LIKE ?";
        filtro.push('%' + request.query.busca + '%');
    }

    if (request.query.ind_entrega) {
        ssql += " AND ind_entrega = ?";
        filtro.push(request.query.ind_entrega);
    }

    if (request.query.ind_retira) {
        ssql += " AND ind_retira = ?";
        filtro.push(request.query.ind_retira);
    }

    db.query(ssql, filtro, function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {
            return response.status(200).json(result);
        }
    });
});

controllerMercados.get("/mercados/:id_mercado/categorias", function(request, response){
    let ssql = "SELECT DISTINCT pc.id_categoria, pc.descricao FROM produto_categoria AS pc";
        ssql += " INNER JOIN produto AS p ON p.id_categoria = pc.id_categoria";
        ssql += " WHERE p.id_mercado = ?";
        ssql += " ORDER BY pc.ordem";

    db.query(ssql, [request.params.id_mercado], function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(200).json(result);
        }
    });
});

controllerMercados.get("/mercados/:id_mercado/produtos", function(request, response){
    let filtro = [];     
    let ssql = "SELECT * FROM produto";
    ssql += " WHERE id_mercado = ?";

    filtro.push(request.params.id_mercado);

    if (request.query.busca) {
        ssql += " AND nome LIKE ?";
        filtro.push('%' + request.query.busca + '%');
    }

    if (request.query.id_categoria) {
        ssql += " AND id_categoria = ?";
        filtro.push(request.query.id_categoria);
    }

    db.query(ssql, filtro, function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(200).json(result);
        }
    });
});

export default controllerMercados;