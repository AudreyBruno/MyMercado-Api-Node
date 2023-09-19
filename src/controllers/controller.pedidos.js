import { Router } from "express";
import db from "../config/database.js";

const controllerPedidos = Router();

controllerPedidos.get("/pedidos/:id_pedido", function(request, response){
    let ssql = "SELECT p.*, m.nome AS nome_mercado, m.endereco AS end_mercado FROM pedido p ";
    ssql += "JOIN mercado m ON (m.id_mercado = p.id_mercado) ";
    ssql += "WHERE p.id_pedido = ?";

    db.query(ssql, request.params.id_pedido, function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {   
            let id_pedido = result[0].id_pedido;
            let jsonPedido = result[0];

            let ssql = "SELECT i.id_item, i.id_produto, i.qtd, i.vl_unitario, i.vl_total, p.descricao, p.url_foto FROM pedido_item i ";
            ssql += "JOIN produto p ON (p.id_produto = i.id_produto) ";
            ssql += "WHERE i.id_pedido = ?";

            db.query(ssql, id_pedido, function(err, result){
                if (err) {
                    return response.status(500).send(err);
                } else {
                    jsonPedido["itens"] = result;

                    return response.status(200).json(jsonPedido);
                }
            });
        }
    });
});

controllerPedidos.get("/pedidos", function(request, response){
    let ssql = "SELECT p.id_pedido, p.id_mercado, p.id_usuario, p.dt_pedido, p.vl_subtotal, p.vl_entrega, "
    ssql += "p.vl_total, p.endereco, p.bairro, p.cidade, p.uf, p.cep, m.nome, COUNT(*) AS qtd_itens "
    ssql += "FROM pedido p ";
    ssql += "JOIN pedido_item i ON (i.id_pedido = p.id_pedido) ";
    ssql += "JOIN mercado m ON (m.id_mercado = p.id_mercado) ";
    ssql += "WHERE p.id_usuario = ? ";
    ssql += "GROUP BY p.id_pedido, p.id_mercado, p.id_usuario, p.dt_pedido, p.vl_subtotal, p.vl_entrega, p.vl_total, "
    ssql += "p.endereco, p.bairro, p.cidade, p.uf, p.cep, m.nome ";
    ssql += "ORDER BY p.id_pedido DESC";

    db.query(ssql, request.query.id_usuario, function(err, result) {
        if (err) {
            return response.status(500).send(err);
        } else {            
            return response.status(result.length > 0 ? 200 : 404).json(result);
        }
    });
});

controllerPedidos.post("/pedidos", function(request, response){
    db.getConnection(function(err, conn){
        conn.beginTransaction(function(err){
            const {id_mercado, id_usuario, vl_subtotal, vl_entrega,vl_total, endereco, bairro, cidade, uf, cep} = request.body;


            let ssql = "INSERT INTO pedido (id_mercado, id_usuario, dt_pedido, vl_subtotal, vl_entrega,"
            ssql += " vl_total, endereco, bairro, cidade, uf, cep)";
            ssql += " VALUES(?, ?, CURRENT_TIMESTAMP(), ?, ?, ?, ?, ?, ?, ?, ?)";
            

            conn.query(ssql, [id_mercado, id_usuario, vl_subtotal, vl_entrega,vl_total, endereco, bairro, cidade, uf, cep], function(err, result) {
                if (err) {
                    conn.rollback();
                    return response.status(500).send(err);
                } else {            
                    let id_pedido = result.insertId;
                    let valuesPedidoItem = [];

                    request.body.itens.map(function(item){
                        valuesPedidoItem.push([id_pedido, item.id_produto, item.qtd, item.vl_unitario, item.vl_total]);
                    });

                    let ssql = "INSERT INTO pedido_item (id_pedido, id_produto, qtd, vl_unitario, vl_total)";
                    ssql += " VALUES ?";
                    
                    conn.query(ssql, [valuesPedidoItem], function(err, result){
                        conn.release();

                        if (err) {
                            conn.rollback();
                            return response.status(500).send(err);
                        } else {
                            conn.commit();
                            return response.status(201).json({id_pedido});
                        }
                    });
                }
            });
        })
    });
});

export default controllerPedidos;