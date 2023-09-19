import mysql from "mysql";

//Conexão com o banco
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "meu_mercado"
});

export default db;