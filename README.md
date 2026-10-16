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
