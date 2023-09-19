import { Router } from "express";
import db from "../config/database.js";

const controllerCategorias = Router();

controllerCategorias.get("/mercados/categorias", function(request, response){
    let ssql = "SELECT * FROM produto_categoria";

    db.query(ssql, function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(result.length > 0 ? 200 : 404).json(result);
        }
    });
});

export default controllerCategorias;