const form = document.getElementById('form-pessoa');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const mensagem = document.getElementById('mensagem');
const tituloForm = document.getElementById('titulo-form');
const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');

let cpfEmEdicao = null;

function mascararCpf(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

async function api(metodo, url, corpo) {
  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (res.status === 204) return null;
  const dados = await res.json();
  if (!res.ok) throw new Error(dados.erro);
  return dados;
}

function criarCelula(texto, classe) {
  const td = document.createElement('td');
  td.textContent = texto;
  if (classe) td.className = classe;
  return td;
}

function criarBotao(texto, classe, aoClicar) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.textContent = texto;
  botao.className = `pequeno ${classe}`;
  botao.addEventListener('click', aoClicar);
  return botao;
}

async function carregar() {
  const pessoas = await api('GET', '/pessoas');
  lista.replaceChildren(
    ...pessoas.map((p) => {
      const tr = document.createElement('tr');
      const botoes = criarCelula('', 'botoes');
      botoes.append(
        criarBotao('Editar', 'secundario', () => editar(p)),
        criarBotao('Excluir', 'perigo', () => remover(p)),
      );
      tr.append(
        criarCelula(mascararCpf(p.cpf)),
        criarCelula(p.nome),
        criarCelula(formatarData(p.dataNascimento)),
        criarCelula(`${p.idade} anos`, 'idade'),
        botoes,
      );
      return tr;
    }),
  );
  vazio.hidden = pessoas.length > 0;
}

function editar(pessoa) {
  cpfEmEdicao = pessoa.cpf;
  form.cpf.value = mascararCpf(pessoa.cpf);
  form.cpf.disabled = true;
  form.nome.value = pessoa.nome;
  form.dataNascimento.value = pessoa.dataNascimento;
  tituloForm.textContent = 'Editar pessoa';
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.hidden = false;
  mostrarMensagem('', '');
}

function limparFormulario() {
  cpfEmEdicao = null;
  form.reset();
  form.cpf.disabled = false;
  tituloForm.textContent = 'Nova pessoa';
  btnSalvar.textContent = 'Cadastrar';
  btnCancelar.hidden = true;
}

async function remover(pessoa) {
  if (!confirm(`Excluir ${pessoa.nome}?`)) return;
  await api('DELETE', `/pessoas/${pessoa.cpf}`);
  mostrarMensagem(`${pessoa.nome} excluído(a).`, 'ok');
  if (cpfEmEdicao === pessoa.cpf) limparFormulario();
  await carregar();
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = {
    nome: form.nome.value,
    dataNascimento: form.dataNascimento.value,
  };
  try {
    if (cpfEmEdicao) {
      const p = await api('PUT', `/pessoas/${cpfEmEdicao}`, dados);
      mostrarMensagem(`${p.nome} atualizado(a): ${p.idade} anos.`, 'ok');
    } else {
      const p = await api('POST', '/pessoas', { ...dados, cpf: form.cpf.value });
      mostrarMensagem(`${p.nome} cadastrado(a): ${p.idade} anos.`, 'ok');
    }
    limparFormulario();
    await carregar();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

btnCancelar.addEventListener('click', () => {
  limparFormulario();
  mostrarMensagem('', '');
});

carregar();
