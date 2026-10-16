const { validarCpf, limparCpf } = require('../../src/cpf');

describe('limparCpf', () => {
  test('remove pontos e traço', () => {
    expect(limparCpf('529.982.247-25')).toBe('52998224725');
  });
});

describe('validarCpf', () => {
  test.each(['52998224725', '529.982.247-25', '111.444.777-35'])('aceita CPF válido: %s', (cpf) => {
    expect(validarCpf(cpf)).toBe(true);
  });

  test.each([
    '52998224724', // dígito verificador errado
    '11111111111', // todos os dígitos iguais
    '123', // tamanho errado
    '',
    null,
    'abcdefghijk',
  ])('rejeita CPF inválido: %p', (cpf) => {
    expect(validarCpf(cpf)).toBe(false);
  });
});
