# Challenge Users Application

Este é um projeto fullstack com frontend em Next.js e backend em Node.js.

## Requisitos

- Docker e Docker Compose instalados
- Node.js (versão 18 ou superior)
- npm ou yarn

## Configuração do Ambiente

1. Inicie os serviços do banco de dados (PostgreSQL) e cache (Redis) usando Docker:

   ```bash
   # Para Windows
   docker-compose up -d

   # Para Mac/Linux
   docker compose up -d
   ```

2. Configure o backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. Configure o frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Endpoints Disponíveis

- Backend: http://localhost:3010
- Frontend: http://localhost:4000

## Comandos Úteis

- Para parar os serviços Docker:
  ```bash
  docker-compose down
  ```

- Para ver os logs do backend:
  ```bash
  npm run start:dev
  ```

## Estrutura do Projeto

- `/backend`: Código do backend em Node.js
- `/frontend`: Código do frontend em Next.js
- `/docker`: Configurações do Docker

## Tecnologias Utilizadas

- Frontend: Next.js, TypeScript, React
- Backend: Node.js, TypeScript, Express
- Banco de Dados: PostgreSQL
- Cache: Redis
- Gerenciamento de Estado: Zustand
- Estilização: Tailwind CSS

## Observações

- Certifique-se de ter as variáveis de ambiente configuradas corretamente em ambos os projetos
- Os serviços Docker devem estar rodando antes de iniciar o backend e o frontend
- O backend deve ser iniciado antes do frontend
