const express = require('express');
const { PessoaService, ValidationError, NotFoundError, ConflictError } = require('./pessoaService');

function criarApp(service = new PessoaService()) {
  const app = express();
  app.use(express.json());

  app.get('/pessoas', (req, res) => res.json(service.listar()));

  app.get('/pessoas/:cpf', (req, res) => res.json(service.buscar(req.params.cpf)));

  app.post('/pessoas', (req, res) => res.status(201).json(service.criar(req.body)));

  app.put('/pessoas/:cpf', (req, res) => res.json(service.atualizar(req.params.cpf, req.body)));

  app.delete('/pessoas/:cpf', (req, res) => {
    service.remover(req.params.cpf);
    res.status(204).end();
  });

  // eslint-disable-next-line no-unused-vars -- o Express exige 4 parâmetros no handler de erro
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) return res.status(400).json({ erro: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ erro: err.message });
    if (err instanceof ConflictError) return res.status(409).json({ erro: err.message });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno' });
  });

  return app;
}

module.exports = { criarApp };
