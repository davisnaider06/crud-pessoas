# CRUD de Pessoas

API REST em JavaScript (Node.js + Express) para cadastro de pessoas com **CPF, nome e data de nascimento**, com **cálculo automático da idade**. Desenvolvida com **TDD**.

## Requisitos da atividade

| Requisito                  | Como foi atendido                                               |
| -------------------------- | --------------------------------------------------------------- |
| CRUD em JavaScript com TDD | Testes escritos antes do código (veja o histórico de commits)   |
| Controle de versionamento  | Git + GitHub                                                    |
| Pull Request               | Branch `feature/crud-pessoas` → `main`                          |
| Análise estática           | ESLint (`npm run lint`)                                         |
| Formatação                 | Prettier (`npm run format:check`)                               |
| Testes unitários           | Jest – `tests/unit` (idade, CPF, serviço)                       |
| Testes de integração       | Jest + Supertest – `tests/integration` (API HTTP)               |
| Criar imagem               | `Dockerfile`, construída e testada no GitHub Actions            |
| CI                         | `.github/workflows/ci.yml` roda tudo a cada push e pull request |

## Endpoints

| Método | Rota            | Descrição                                |
| ------ | --------------- | ---------------------------------------- |
| GET    | `/pessoas`      | Lista todas as pessoas (com idade)       |
| GET    | `/pessoas/:cpf` | Busca uma pessoa pelo CPF                |
| POST   | `/pessoas`      | Cadastra `{ cpf, nome, dataNascimento }` |
| PUT    | `/pessoas/:cpf` | Atualiza `nome` e/ou `dataNascimento`    |
| DELETE | `/pessoas/:cpf` | Remove a pessoa                          |

`dataNascimento` usa o formato `AAAA-MM-DD`. O CPF é validado pelos dígitos verificadores e aceito com ou sem máscara.

Exemplo:

```bash
curl -X POST http://localhost:3000/pessoas -H "Content-Type: application/json" -d '{"cpf":"529.982.247-25","nome":"Maria Silva","dataNascimento":"2000-01-10"}'
```

Resposta: `{"cpf":"52998224725","nome":"Maria Silva","dataNascimento":"2000-01-10","idade":26}`

## Rodando

```bash
npm install
npm start               # API em http://localhost:3000
npm test                # todos os testes
npm run test:unit
npm run test:integration
npm run test:coverage
npm run lint
npm run format:check
```

## Docker

```bash
docker build -t crud-pessoas .
docker run -p 3000:3000 crud-pessoas
```

## Evidências (pasta `prints/`)

| Etapa do fluxo         | Prints                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| TDD – cálculo de idade | `01` red · `02` green · `03` refactor                                                                     |
| Front                  | `04` teste red · `05` teste green · `06` tela de cadastro                                                 |
| Back                   | `07` API REST respondendo JSON                                                                            |
| Análise estática       | `08` ESLint                                                                                               |
| Formatação             | `09` Prettier                                                                                             |
| Testes                 | `10` unitários · `11` integração · `12` cobertura                                                         |
| Git / GitHub           | `13` histórico de commits · `14` repositório · `15` commits · `16` pull request                           |
| CI/CD (GitHub Actions) | `17` pipeline · `18` passos do job de testes · `20` log de lint/testes · `19`/`21` build da imagem Docker |
