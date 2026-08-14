# XIMED - Painel de Atendimento (Backend)

API do painel de fila de atendimento da clínica, feita pro teste técnico da XIMED. Node.js + Express + Prisma + PostgreSQL.

## Stack

- Node.js (ESM)
- Express
- Prisma ORM
- PostgreSQL

## Rodando localmente

Precisa ter o Node instalado (18+) e acesso a um banco PostgreSQL.

1. Instala as dependências

```bash
npm install
```

2. Cria um `.env` na raiz com base no `.env.example`:

Dentro do .env.example tem o banco de dados que deve ser colado, para visualização do mesmo.
Caso deseje criar um novo, usar semelhante embaixo com suas credenciais, para o mesmo funcionar
Obs: Banco feito em PostgreSQL.

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
DIRECT_URL="postgresql://usuario:senha@host:porta/banco"
PORT=3333
```

3. Roda as migrations do Prisma pra criar as tabelas no banco:

```bash
npx prisma migrate deploy
```

4. Gera o client do Prisma (geralmente já roda sozinho no `npm install`, mas se der problema):

```bash
npx prisma generate
```

5. Sobe o servidor:

```bash
npm run dev
```

API sobe em `http://localhost:3333`.

## Scripts

- `npm run dev` — roda em desenvolvimento (nodemon)
- `npm start` — roda em produção

## Rotas

### Pessoas (`/persons`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/persons` | Cadastra uma pessoa |
| GET | `/persons` | Lista todas as pessoas |
| GET | `/persons/:id` | Busca pessoa por id (com histórico de atendimentos) |
| PUT | `/persons/:id` | Atualiza pessoa |
| DELETE | `/persons/:id` | Remove pessoa |

### Atendimentos (`/atendimentos`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/atendimentos` | Coloca uma pessoa na fila (status inicial: RECEPCAO) |
| GET | `/atendimentos` | Lista a fila (aceita `?status=` e `?activeOnly=true`) |
| GET | `/atendimentos/:id` | Busca atendimento por id |
| PATCH | `/atendimentos/:id/status` | Altera status/prioridade/notas do atendimento |
| DELETE | `/atendimentos/:id` | Remove atendimento da fila |

### Health check

`GET /health` — confirma se a API está de pé.

## Status do atendimento

RECEPCAO → ENFERMAGEM → MEDICO → LIBERACAO

Também existe o status `CANCELADO`, pra atendimentos interrompidos antes de chegar na liberação.

## Modelagem

- **Person**: dados da pessoa (nome, CPF único, telefone)
- **Atendimento**: cada passagem pela fila, vinculada a uma Person, com status, prioridade e notas

Uma pessoa pode ter vários atendimentos ao longo do tempo (histórico).
