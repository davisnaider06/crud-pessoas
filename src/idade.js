const FORMATO_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATA_INVALIDA = 'Data de nascimento inválida';

/**
 * Converte 'AAAA-MM-DD' em { ano, mes, dia }, validando se a data existe no calendário.
 */
function parseData(texto) {
  const match = typeof texto === 'string' ? FORMATO_DATA.exec(texto) : null;
  if (!match) throw new Error(DATA_INVALIDA);

  const [ano, mes, dia] = match.slice(1).map(Number);
  const data = new Date(ano, mes - 1, dia);
  const existe =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!existe) throw new Error(DATA_INVALIDA);

  return { ano, mes, dia };
}

/**
 * Indica se, na data `hoje`, o aniversário do ano corrente já chegou.
 * Quem nasceu em 29/02 completa ano em 01/03 nos anos não bissextos.
 */
function jaFezAniversario({ mes, dia }, hoje) {
  const mesHoje = hoje.getMonth() + 1;
  return mesHoje > mes || (mesHoje === mes && hoje.getDate() >= dia);
}

/**
 * Calcula a idade em anos completos na data `hoje`.
 */
function calcularIdade(dataNascimento, hoje = new Date()) {
  const nascimento = parseData(dataNascimento);
  const idade = hoje.getFullYear() - nascimento.ano - (jaFezAniversario(nascimento, hoje) ? 0 : 1);

  if (idade < 0) throw new Error('Data de nascimento no futuro');
  return idade;
}

module.exports = { calcularIdade };
