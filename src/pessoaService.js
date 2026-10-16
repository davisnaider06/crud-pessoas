const { calcularIdade } = require('./idade');
const { validarCpf, limparCpf } = require('./cpf');

class ValidationError extends Error {}
class NotFoundError extends Error {}
class ConflictError extends Error {}

class PessoaService {
  constructor({ hoje = () => new Date() } = {}) {
    this.hoje = hoje;
    this.pessoas = new Map(); // armazenamento em memória, chave = CPF sem máscara
  }

  comIdade(pessoa) {
    return { ...pessoa, idade: calcularIdade(pessoa.dataNascimento, this.hoje()) };
  }

  validarNome(nome) {
    const limpo = typeof nome === 'string' ? nome.trim() : '';
    if (!limpo) throw new ValidationError('Nome é obrigatório');
    return limpo;
  }

  validarDataNascimento(dataNascimento) {
    try {
      calcularIdade(dataNascimento, this.hoje());
    } catch (err) {
      throw new ValidationError(err.message);
    }
    return dataNascimento;
  }

  obter(cpf) {
    const pessoa = this.pessoas.get(limparCpf(cpf));
    if (!pessoa) throw new NotFoundError('Pessoa não encontrada');
    return pessoa;
  }

  criar({ cpf, nome, dataNascimento } = {}) {
    if (!validarCpf(cpf)) throw new ValidationError('CPF inválido');
    const chave = limparCpf(cpf);
    if (this.pessoas.has(chave)) throw new ConflictError('CPF já cadastrado');

    const pessoa = {
      cpf: chave,
      nome: this.validarNome(nome),
      dataNascimento: this.validarDataNascimento(dataNascimento),
    };
    this.pessoas.set(chave, pessoa);
    return this.comIdade(pessoa);
  }

  listar() {
    return [...this.pessoas.values()].map((p) => this.comIdade(p));
  }

  buscar(cpf) {
    return this.comIdade(this.obter(cpf));
  }

  atualizar(cpf, { nome, dataNascimento } = {}) {
    const atual = this.obter(cpf);
    const atualizada = {
      ...atual,
      ...(nome !== undefined && { nome: this.validarNome(nome) }),
      ...(dataNascimento !== undefined && {
        dataNascimento: this.validarDataNascimento(dataNascimento),
      }),
    };
    this.pessoas.set(atual.cpf, atualizada);
    return this.comIdade(atualizada);
  }

  remover(cpf) {
    this.pessoas.delete(this.obter(cpf).cpf);
  }
}

module.exports = { PessoaService, ValidationError, NotFoundError, ConflictError };
