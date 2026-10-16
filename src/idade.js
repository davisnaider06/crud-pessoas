const FORMATO_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Converte 'AAAA-MM-DD' em { ano, mes, dia }, validando se a data existe no calendário.
 */
function parseData(texto) {
  const match = typeof texto === 'string' ? FORMATO_DATA.exec(texto) : null;
  if (!match) throw new Error('Data de nascimento inválida');

  const [ano, mes, dia] = match.slice(1).map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    throw new Error('Data de nascimento inválida');
  }
  return { ano, mes, dia };
}

/**
 * Calcula a idade em anos completos na data `hoje`.
 * Quem nasceu em 29/02 completa ano em 01/03 nos anos não bissextos.
 */
function calcularIdade(dataNascimento, hoje = new Date()) {
  const { ano, mes, dia } = parseData(dataNascimento);
  const anoHoje = hoje.getFullYear();
  const mesHoje = hoje.getMonth() + 1;
  const diaHoje = hoje.getDate();

  let idade = anoHoje - ano;
  if (mesHoje < mes || (mesHoje === mes && diaHoje < dia)) idade--;

  if (idade < 0) throw new Error('Data de nascimento no futuro');
  return idade;
}

module.exports = { calcularIdade };
