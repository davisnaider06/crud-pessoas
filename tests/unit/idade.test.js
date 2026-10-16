const { calcularIdade } = require('../../src/idade');

describe('calcularIdade', () => {
  const hoje = new Date(2026, 9, 16); // 16/10/2026

  test('calcula a idade quando o aniversário já passou no ano', () => {
    expect(calcularIdade('2000-01-10', hoje)).toBe(26);
  });

  test('calcula a idade quando o aniversário ainda não chegou no ano', () => {
    expect(calcularIdade('2000-12-25', hoje)).toBe(25);
  });

  test('completa ano exatamente no dia do aniversário', () => {
    expect(calcularIdade('2000-10-16', hoje)).toBe(26);
  });

  test('ainda não completou ano na véspera do aniversário', () => {
    expect(calcularIdade('2000-10-17', hoje)).toBe(25);
  });

  test('retorna 0 para quem nasceu hoje', () => {
    expect(calcularIdade('2026-10-16', hoje)).toBe(0);
  });

  test('trata nascido em 29/02 em ano não bissexto', () => {
    expect(calcularIdade('2004-02-29', new Date(2025, 1, 28))).toBe(20);
    expect(calcularIdade('2004-02-29', new Date(2025, 2, 1))).toBe(21);
  });

  test('lança erro para data no futuro', () => {
    expect(() => calcularIdade('2030-01-01', hoje)).toThrow('Data de nascimento no futuro');
  });

  test.each(['', '16/10/2000', '2000-13-01', '2000-02-30', 'abc', null, undefined])(
    'lança erro para data inválida: %p',
    (valor) => {
      expect(() => calcularIdade(valor, hoje)).toThrow('Data de nascimento inválida');
    },
  );
});
