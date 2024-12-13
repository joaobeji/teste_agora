const express = require("express");
const router = express.Router();
const db = require("./src/db");

// Rota para listar produtos
router.get("/", (req, res) => {
  const sql = "SELECT * FROM produtos";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Rota para adicionar produto
router.post("/", (req, res) => {
  const { nome, preco, descricao } = req.body;
  const sql = "INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)";
  db.query(sql, [nome, preco, descricao], (err, result) => {
    if (err) throw err;
    res.json({
      message: "Produto cadastrado com sucesso!",
      produtoId: result.insertId,
    });
  });
});

// Rota para editar produto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao } = req.body;
  const sql =
    "UPDATE produtos SET nome = ?, preco = ?, descricao = ? WHERE id = ?";
  db.query(sql, [nome, preco, descricao, id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Produto atualizado com sucesso!" });
  });
});

// Rota para deletar produto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM produtos WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Produto deletado com sucesso!" });
  });
});

module.exports = router;
