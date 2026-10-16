function limparCpf(cpf) {
  return String(cpf ?? '').replace(/[.\-\s]/g, '');
}

function digitoVerificador(digitos) {
  const pesoInicial = digitos.length + 1;
  const soma = digitos.reduce((acc, d, i) => acc + d * (pesoInicial - i), 0);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

function validarCpf(cpf) {
  const limpo = limparCpf(cpf);
  if (!/^\d{11}$/.test(limpo)) return false;
  if (/^(\d)\1{10}$/.test(limpo)) return false;

  const digitos = limpo.split('').map(Number);
  const dv1 = digitoVerificador(digitos.slice(0, 9));
  const dv2 = digitoVerificador(digitos.slice(0, 10));
  return dv1 === digitos[9] && dv2 === digitos[10];
}

module.exports = { validarCpf, limparCpf };
