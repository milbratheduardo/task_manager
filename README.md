🚀 Task Manager

Aplicação completa de gerenciamento de tarefas inspirada em ferramentas como ClickUp e Trello.

📚 Sobre o Projeto
O Task Manager permite que usuários criem, editem, visualizem e excluam tarefas.
Inclui funcionalidades como priorização, filtros de status, sistema de autenticação, atribuição de membros e painel administrativo.
A aplicação é responsiva e oferece uma experiência fluida tanto no desktop quanto no mobile.

🎯 Funcionalidades
Cadastro e login de usuários (com atribuição de perfis: Admin ou Membro)

Criação, edição e exclusão de tarefas

Atribuição de tarefas a múltiplos membros

Definição de prioridade (Alta, Média, Baixa) e status (Pendente, Em Progresso, Completada)

Filtros de tarefas por status

Barra de pesquisa por título da tarefa

Checklist interno para acompanhar subtarefas

Painel de dashboard individual para membros

Painel administrativo para gerenciar todas as tarefas e usuários

Interface 100% responsiva

🛠️ Tecnologias Utilizadas
Frontend:
React + Vite

TypeScript

TailwindCSS

Axios

React Router

Recharts (Gráficos)

Backend:
Node.js

Express

TypeScript

MongoDB + Mongoose

JWT Authentication

Multer (Upload de imagens)

📦 Instalação e Execução
Clone o repositório:

git clone https://github.com/seu-usuario/task-manager.git
cd task-manager

Backend (API)
cd backend
npm install
npm run dev
O servidor será iniciado em http://localhost:8000.

Frontend (Interface)
cd frontend
npm install
npm run dev
O frontend será iniciado em http://localhost:5173.

🔐 Rotas e Permissões
Admin:

Pode criar, editar e excluir tarefas

Pode gerenciar usuários (listar, excluir)

Membro:

Visualiza tarefas atribuídas a si.

⚡ Observações
Este projeto priorizou:

Funcionalidade completa de CRUD de tarefas

Sistema de autenticação JWT

Gestão visual de tarefas com filtros e gráficos

Experiência responsiva e leve

Algumas funcionalidades extras como testes automatizados e upload múltiplo de arquivos podem ser adicionados em versões futuras.



