# API Cadastro de Usuário

API REST para cadastro e gerenciamento de usuários, com autenticação via JWT (OAuth2 Password Flow), persistência em SQLite usando SQLAlchemy e um frontend simples em HTML/CSS/JS para consumo da API.

## Stack

- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT (python-jose)
- Password hashing (passlib + bcrypt)
- Frontend (HTML/CSS/JS)

## Funcionalidades

- CRUD de usuários
  - Criar usuário
  - Listar usuários
  - Buscar usuário por ID
  - Atualizar usuário
  - Deletar usuário
- Validação de email único
- Senhas com hash antes de salvar no banco
- Autenticação JWT (endpoint de token)
- Documentação automática via Swagger UI (/docs)

## Estrutura do Projeto

```text
python-backend/
  app/
    core/
    routers/
    database.py
    models.py
    schemas.py
    main.py
  frontend/
    index.html
    style.css
    app.js
  users.db
  requirements.txt
  .gitignore
  README.md

  Setup
1) Criar e ativar um ambiente virtual (recomendado)

Windows (PowerShell):

cd python-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1


Se o PowerShell bloquear a ativação (execution policy), execute uma vez:

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

2) Instalar dependências
python -m pip install -r requirements.txt

3) Rodar o servidor
python -m uvicorn app.main:app --reload


Servidor:

API: http://127.0.0.1:8000/

Docs (Swagger UI): http://127.0.0.1:8000/docs

Uso
Criar um usuário

Endpoint:

POST /users/

Exemplo de body (JSON):

{
  "name": "Felipe Roberto",
  "email": "felipe@email.com",
  "age": 24,
  "password": "123456"
}


Observações:

O email deve ser único.

A senha é armazenada como hash no banco.

Login (obter token)

Endpoint:

POST /auth/token

Este endpoint usa application/x-www-form-urlencoded (OAuth2 password flow).

No Swagger UI:

Abra /docs

Encontre POST /auth/token

Informe:

username: email cadastrado

password: senha cadastrada

Execute e copie o access_token

Exemplo via curl:

curl -X POST "http://127.0.0.1:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=felipe@email.com&password=123456"


Resposta esperada:

{
  "access_token": "YOUR_TOKEN_HERE",
  "token_type": "bearer"
}

Autorizar no Swagger UI

Abra: http://127.0.0.1:8000/docs

Clique em Authorize

Cole o token no formato:

Bearer YOUR_TOKEN_HERE


Confirme

Após isso, endpoints protegidos passam a funcionar diretamente pelo Swagger.

Frontend (local)

O frontend é uma página simples que consome a API via HTTP.

Opção A (mais rápida)

Abra diretamente:

python-backend/frontend/index.html

Opção B (recomendado)

Servir localmente para evitar limitações do browser:

cd python-backend/frontend
python -m http.server 5500


Abra:

http://127.0.0.1:5500

Notas de Segurança (para fins didáticos)

As senhas são hashadas antes de serem armazenadas no banco.

Tokens JWT são assinados e usados para autenticação.

CORS está liberado para desenvolvimento local; em produção deve ser restrito a origens confiáveis.

Roadmap

Trocar SQLite por PostgreSQL

Migrations com Alembic

Testes automatizados (pytest)

Paginação e filtros em /users

Melhorar o frontend com fluxo completo de login e persistência de token

Licença

Projeto para fins de estudo e portfólio.
