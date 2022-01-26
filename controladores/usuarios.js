const conexao = require("../conexao");

const listarUsuarios = async (req, res) => {
  try {
    const { rows: usuarios } = await conexao.query("select * from usuarios");

    for (const usuario of usuarios) {
      const query = "select * from emprestimos where usuario_id = $1";
      const { rows: emprestimos } = await conexao.query(query, [usuario.id]);
      usuario.emprestimos = emprestimos;
    }

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const obterUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await conexao.query(
      "select * from usuarios where id = $1",
      [id]
    );
    if (usuario.rowCount === 0) {
      return res.status(404).json("Usuario não encontrado");
    }

    return res.status(200).json(usuario.rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const cadastrarUsuario = async (req, res) => {
  const { nome, idade, email, telefone, cpf } = req.body;

  if (!nome) return res.status(400).json("O campo nome é obrigatório.");
  if (!email) return res.status(400).json("O campo email é obrigatório.");
  if (!cpf) return res.status(400).json("O campo cpf é obrigatório.");

  try {
    const { rows: usuariosCadastrados } = await conexao.query(
      "select * from usuarios"
    );
    usuariosCadastrados.forEach((u) => {
      if (u.email === email)
        return res.status(400).json("email já cadastrado.");
      if (u.cpf === cpf) return res.status(400).json("cpf já cadastrado.");
    });

    const query =
      "insert into usuarios (nome, idade, email, telefone, cpf) values ($1, $2, $3, $4, $5)";
    const autor = await conexao.query(query, [
      nome,
      idade,
      email,
      telefone,
      cpf,
    ]);

    if (autor.rowCount === 0) {
      return res.status(400).json("Não foi possivel cadastrar o usuario");
    }

    return res.status(200).json("Usuario cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, email, telefone, cpf } = req.body;

  if (!nome) return res.status(400).json("O campo nome é obrigatório.");
  if (!email) return res.status(400).json("O campo email é obrigatório.");
  if (!cpf) return res.status(400).json("O campo cpf é obrigatório.");

  try {
    const { rows: usuariosCadastrados } = await conexao.query(
      "select * from usuarios"
    );
    usuariosCadastrados.forEach((u) => {
      if (u.email === email)
        return res.status(400).json("email já cadastrado.");
      if (u.cpf === cpf) return res.status(400).json("cpf já cadastrado.");
    });

    const usuario = await conexao.query(
      "select * from usuarios where id = $1",
      [id]
    );

    if (usuario.rowCount === 0) {
      return res.status(404).json("Usuario não encontrado");
    }

    const query =
      "update usuarios set nome = $1, idade = $2, email = $3, telefone = $4, cpf = $5 where id = $6";
    const autorAtualizado = await conexao.query(query, [
      nome,
      idade,
      email,
      telefone,
      cpf,
      id,
    ]);

    if (autorAtualizado.rowCount === 0) {
      return res.status(404).json("Não foi possível atualizar o autor");
    }

    return res.status(200).json("Autor foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const excluirUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await conexao.query(
      "select * from usuarios where id = $1",
      [id]
    );

    if (usuario.rowCount === 0) {
      return res.status(404).json("Usuario não encontrado");
    }

    const query = "delete from usuarios where id = $1";
    const usuarioExcluido = await conexao.query(query, [id]);

    if (usuarioExcluido.rowCount === 0) {
      return res.status(404).json("Não foi possível excluir o usuario");
    }

    return res.status(200).json("Usuario foi excluido com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarUsuarios,
  obterUsuario,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario,
};
