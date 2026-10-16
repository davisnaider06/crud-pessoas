const request = require('supertest');
const { criarApp } = require('../../src/app');
const { PessoaService } = require('../../src/pessoaService');

describe('API /pessoas (integração)', () => {
  let app;
  const maria = { cpf: '529.982.247-25', nome: 'Maria Silva', dataNascimento: '2000-01-10' };

  beforeEach(() => {
    app = criarApp(new PessoaService({ hoje: () => new Date(2026, 9, 16) }));
  });

  test('fluxo completo: criar, listar, buscar, atualizar e remover', async () => {
    const criada = await request(app).post('/pessoas').send(maria);
    expect(criada.status).toBe(201);
    expect(criada.body).toEqual({ ...maria, cpf: '52998224725', idade: 26 });

    const lista = await request(app).get('/pessoas');
    expect(lista.status).toBe(200);
    expect(lista.body).toHaveLength(1);

    const busca = await request(app).get('/pessoas/52998224725');
    expect(busca.status).toBe(200);
    expect(busca.body.nome).toBe('Maria Silva');

    const atualizada = await request(app)
      .put('/pessoas/52998224725')
      .send({ dataNascimento: '1990-12-25' });
    expect(atualizada.status).toBe(200);
    expect(atualizada.body.idade).toBe(35);

    const removida = await request(app).delete('/pessoas/52998224725');
    expect(removida.status).toBe(204);

    const depois = await request(app).get('/pessoas/52998224725');
    expect(depois.status).toBe(404);
  });

  test('POST com CPF inválido retorna 400', async () => {
    const res = await request(app)
      .post('/pessoas')
      .send({ ...maria, cpf: '123' });
    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/CPF/);
  });

  test('POST com CPF duplicado retorna 409', async () => {
    await request(app).post('/pessoas').send(maria);
    const res = await request(app).post('/pessoas').send(maria);
    expect(res.status).toBe(409);
  });

  test('PUT em pessoa inexistente retorna 404', async () => {
    const res = await request(app).put('/pessoas/52998224725').send({ nome: 'X' });
    expect(res.status).toBe(404);
  });

  test('DELETE em pessoa inexistente retorna 404', async () => {
    const res = await request(app).delete('/pessoas/52998224725');
    expect(res.status).toBe(404);
  });

  test('JSON malformado retorna 400', async () => {
    const res = await request(app)
      .post('/pessoas')
      .set('Content-Type', 'application/json')
      .send('{ruim');
    expect(res.status).toBe(400);
  });
});
