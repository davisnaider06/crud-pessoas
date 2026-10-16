const {
  PessoaService,
  ValidationError,
  NotFoundError,
  ConflictError,
} = require('../../src/pessoaService');

describe('PessoaService', () => {
  let service;
  const hoje = () => new Date(2026, 9, 16);
  const pessoaValida = { cpf: '529.982.247-25', nome: 'Maria Silva', dataNascimento: '2000-01-10' };

  beforeEach(() => {
    service = new PessoaService({ hoje });
  });

  describe('criar', () => {
    test('cria pessoa e devolve com idade calculada e CPF normalizado', () => {
      expect(service.criar(pessoaValida)).toEqual({
        cpf: '52998224725',
        nome: 'Maria Silva',
        dataNascimento: '2000-01-10',
        idade: 26,
      });
    });

    test('remove espaços extras do nome', () => {
      expect(service.criar({ ...pessoaValida, nome: '  Maria  ' }).nome).toBe('Maria');
    });

    test('rejeita CPF inválido', () => {
      expect(() => service.criar({ ...pessoaValida, cpf: '11111111111' })).toThrow(ValidationError);
    });

    test('rejeita nome vazio', () => {
      expect(() => service.criar({ ...pessoaValida, nome: '   ' })).toThrow(ValidationError);
    });

    test('rejeita data de nascimento inválida', () => {
      expect(() => service.criar({ ...pessoaValida, dataNascimento: '2000-02-30' })).toThrow(
        ValidationError,
      );
    });

    test('rejeita data de nascimento no futuro', () => {
      expect(() => service.criar({ ...pessoaValida, dataNascimento: '2099-01-01' })).toThrow(
        ValidationError,
      );
    });

    test('rejeita CPF duplicado', () => {
      service.criar(pessoaValida);
      expect(() => service.criar({ ...pessoaValida, cpf: '52998224725' })).toThrow(ConflictError);
    });
  });

  describe('listar', () => {
    test('retorna lista vazia inicialmente', () => {
      expect(service.listar()).toEqual([]);
    });

    test('retorna todas as pessoas cadastradas', () => {
      service.criar(pessoaValida);
      service.criar({ cpf: '111.444.777-35', nome: 'João', dataNascimento: '1990-12-25' });
      const lista = service.listar();
      expect(lista).toHaveLength(2);
      expect(lista[1].idade).toBe(35);
    });
  });

  describe('buscar', () => {
    test('busca por CPF com ou sem máscara', () => {
      service.criar(pessoaValida);
      expect(service.buscar('52998224725').nome).toBe('Maria Silva');
      expect(service.buscar('529.982.247-25').nome).toBe('Maria Silva');
    });

    test('lança NotFoundError se não existir', () => {
      expect(() => service.buscar('52998224725')).toThrow(NotFoundError);
    });
  });

  describe('atualizar', () => {
    test('atualiza nome e data de nascimento e recalcula a idade', () => {
      service.criar(pessoaValida);
      const atualizada = service.atualizar('52998224725', {
        nome: 'Maria Souza',
        dataNascimento: '1990-01-10',
      });
      expect(atualizada).toEqual({
        cpf: '52998224725',
        nome: 'Maria Souza',
        dataNascimento: '1990-01-10',
        idade: 36,
      });
    });

    test('permite atualização parcial', () => {
      service.criar(pessoaValida);
      expect(service.atualizar('52998224725', { nome: 'Outra' }).dataNascimento).toBe('2000-01-10');
    });

    test('valida os dados novos', () => {
      service.criar(pessoaValida);
      expect(() => service.atualizar('52998224725', { nome: '' })).toThrow(ValidationError);
    });

    test('lança NotFoundError se não existir', () => {
      expect(() => service.atualizar('52998224725', { nome: 'X' })).toThrow(NotFoundError);
    });
  });

  describe('remover', () => {
    test('remove a pessoa', () => {
      service.criar(pessoaValida);
      service.remover('52998224725');
      expect(service.listar()).toEqual([]);
    });

    test('lança NotFoundError se não existir', () => {
      expect(() => service.remover('52998224725')).toThrow(NotFoundError);
    });
  });
});
