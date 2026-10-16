const request = require('supertest');
const { criarApp } = require('../../src/app');

describe('Front-end (integração)', () => {
  test('GET / entrega a página com o formulário de cadastro', async () => {
    const res = await request(criarApp()).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('id="form-pessoa"');
    expect(res.text).toContain('name="cpf"');
    expect(res.text).toContain('name="nome"');
    expect(res.text).toContain('name="dataNascimento"');
    expect(res.text).toContain('Idade');
  });

  test('GET /app.js entrega o script do front', async () => {
    const res = await request(criarApp()).get('/app.js');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/javascript/);
  });
});
