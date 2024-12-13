const express = require("express");
const router = express.Router();
const db = require("./src/db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Rota para cadastrar um novo usuário
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  // Criptografar a senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Gerar o token de confirmação
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  // Inserir o usuário no banco de dados
  const query =
    "INSERT INTO usuarios (email, senha, email_verificado) VALUES (?, ?, ?)";
  db.query(query, [email, senhaHash, false], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }

    // Enviar o e-mail de confirmação
    enviarEmailConfirmacao(email, token);

    return res
      .status(201)
      .json({
        message:
          "Usuário cadastrado com sucesso! Verifique seu e-mail para confirmar a conta.",
      });
  });
}); //Fim da Rota para cadastrar

// Rota para login
// Rota para login
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  // Verificar se o usuário existe no banco de dados
  const query = "SELECT * FROM usuarios WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const usuario = results[0];

    // Verificar se o e-mail foi confirmado
    if (!usuario.email_verificado) {
      return res
        .status(401)
        .json({
          message: "Por favor, confirme seu e-mail antes de fazer login.",
        });
    }

    // Comparar a senha
    const isMatch = await bcrypt.compare(senha, usuario.senha);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    return res.status(200).json({ message: "Login bem-sucedido!" });
  });
}); // Fim da Rota para login

// Função para enviar e-mail de confirmação
function enviarEmailConfirmacao(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ou outro serviço de e-mail
    auth: {
      user: "Joaobejieduardo@gmail.com",
      pass: "vroprwbblrkumpsr",
    },
  });

  const url = `http://localhost:3000/usuarios/confirmar-email/${token}`;

  transporter.sendMail(
    {
      from: '"Minha Aplicação" <seuemail@gmail.com>',
      to: email,
      subject: "Confirme seu e-mail",
      html: `<h1>Confirme seu e-mail</h1>
           <p>Clique no link abaixo para confirmar seu e-mail:</p>
           <a href="${url}">Confirmar E-mail</a>`,
    },
    (err, info) => {
      if (err) {
        console.error("Erro ao enviar e-mail:", err);
      } else {
        console.log("E-mail enviado:", info.response);
      }
    }
  );
}

// Rota para confirmar o e-mail
router.get("/confirmar-email/:token", (req, res) => {
  const { token } = req.params;

  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    // Atualizar o banco de dados para marcar o e-mail como verificado
    const query = "UPDATE usuarios SET email_verificado = TRUE WHERE email = ?";
    db.query(query, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao verificar o e-mail." });
      } else {
        res.redirect("/login?confirmed=true");
        // return res.status(200).json({ message: 'E-mail confirmado com sucesso!' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }
});

module.exports = router;
