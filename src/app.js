const express = require("express");
const cors = require('cors');  // Importa o módulo cors
const bodyParser = require("body-parser");
const produtosRoutes = require("../routerProdutos.js");
const usuariosRoutes = require("../routerUsuarios.js");


const path = require("path");
const app = express();
app.use(cors());

const port = process.env.PORT || 2710;  // Porta fornecida pelo host ou 3000
const host = '0.0.0.0';  // Aceitar conexões de qualquer lugar

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 // Rotas para servir arquivos estáticos
 app.use(express.static(__dirname + "/../frontend"));
 app.use(express.static(__dirname + "/../frontend/pages"));
 app.use(express.static(__dirname + "/../frontend/pages/login"));

 // ENDEREÇO DAS PÁGINAS DE PRODUTOS
 app.get("/produto/lista", function (req, res) {
   res.sendFile(
     path.join(__dirname, "..", "frontend", "pages", "produto", "lista.html")
   );
 });

 app.get("/usuarios/produto", function (req, res) {
   res.sendFile(path.join(__dirname, "..", "frontend", "pages", "produto"));
 });

app.use(cors({
  origin: 'http://127.0.0.1:5500',  // Especifica o domínio do frontend
}));

// Rotas de produtos
app.use("/produtos", produtosRoutes);
app.use("/usuarios", usuariosRoutes);

app.listen(port, host, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
