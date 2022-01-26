const conexao = require("../conexao");

const listarEmprestimos = async (req, res) => {
  try {
    const { rows: emprestimos } = await conexao.query(
      "select * from emprestimos"
    );

    return res.status(200).json(emprestimos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const obterEmprestimo = async (req, res) => {
  const { id } = req.params;
  try {
    const emprestimo = await conexao.query(
      "select * from emprestimos where id = $1",
      [id]
    );
    if (emprestimo.rowCount === 0) {
      return res.status(404).json("Emprestimo não encontrado");
    }

    return res.status(200).json(emprestimo.rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const cadastrarEmprestimo = async (req, res) => {
  const { usuario_id, livro_id, status } = req.body;

  if (!usuario_id)
    return res.status(400).json("O campo usuario_id é obrigatório.");
  if (!livro_id) return res.status(400).json("O campo livro_id é obrigatório.");

  try {
    const query =
      "insert into emprestimos (usuario_id, livro_id) values ($1, $2)";
    const emprestimo = await conexao.query(query, [usuario_id, livro_id]);

    if (emprestimo.rowCount === 0) {
      return res.status(400).json("Não foi possivel cadastrar o emprestimo");
    }

    return res.status(200).json("Emprestimo cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const atualizarEmprestimo = async (req, res) => {
  const { id } = req.params;
  const { status, usuario_id, livro_id } = req.body;

  if (!status) return res.status(400).json("Campo status obrigatorio");
  if (usuario_id || livro_id)
    return res
      .status(400)
      .json("Não é possivel alterar o usuario_id ou livro_id");

  try {
    const emprestimo = await conexao.query(
      "select * from emprestimos where id = $1",
      [id]
    );

    if (emprestimo.rowCount === 0) {
      return res.status(404).json("Emprestimo não encontrado");
    }

    const query = "update emprestimos set status = $1 where id = $2";
    const statusAtualizado = await conexao.query(query, [status, id]);

    if (statusAtualizado.rowCount === 0) {
      return res.status(404).json("Não foi possível atualizar o status");
    }

    return res.status(200).json("Status foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
const excluirEmprestimo = async (req, res) => {
  const { id } = req.params;
  try {
    const emprestimo = await conexao.query(
      "select * from emprestimos where id = $1",
      [id]
    );

    if (emprestimo.rowCount === 0) {
      return res.status(404).json("Emprestimo não encontrado");
    }

    const query = "delete from emprestimos where id = $1";
    const emprestimoExcluido = await conexao.query(query, [id]);

    if (emprestimoExcluido.rowCount === 0) {
      return res.status(404).json("Não foi possível excluir o emprestimo");
    }

    return res.status(200).json("Emprestimo foi excluido com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarEmprestimos,
  obterEmprestimo,
  cadastrarEmprestimo,
  atualizarEmprestimo,
  excluirEmprestimo,
};
