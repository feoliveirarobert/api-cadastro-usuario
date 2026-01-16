# API Cadastro de Usuários (FastAPI) + JWT + Frontend

Backend em **FastAPI** com CRUD de usuários e autenticação via **JWT**, acompanhado de um frontend simples para consumir a API.

## Features

- ✅ CRUD de usuários
- ✅ Autenticação com JWT (login e rotas protegidas)
- ✅ Validação com Pydantic
- ✅ Documentação automática (Swagger/OpenAPI)
- ✅ Frontend simples (HTML/CSS/JS)

---

## Stack

- **Backend:** Python + FastAPI
- **Auth:** JWT
- **Banco:** SQLite (arquivo local)
- **Frontend:** HTML + CSS + JavaScript (fetch API)

---

## Estrutura do Projeto

app/
core/
auth.py
security.py
routers/
auth.py
users.py
database.py
main.py
models.py
schemas.py
frontend/
index.html
style.css
app.js
requirements.txt

yaml
Copiar código

---

## Como rodar localmente

### 1) Clonar o repositório
```bash
git clone https://github.com/feoliveirarobert/api-cadastro-usuario
cd api-cadastro-usuario
2) Criar e ativar o ambiente virtual
Windows (PowerShell)

bash
Copiar código
python -m venv .venv
.venv\Scripts\Activate.ps1
Linux/Mac

bash
Copiar código
python3 -m venv .venv
source .venv/bin/activate
3) Instalar dependências
bash
Copiar código
pip install -r requirements.txt
4) Variáveis de ambiente
Crie um arquivo .env na raiz (não versionar). Exemplo:

env
Copiar código
JWT_SECRET_KEY=coloque_uma_chave_bem_forte_aqui
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
Dica: gere uma chave forte com:

bash
Copiar código
python -c "import secrets; print(secrets.token_hex(32))"
5) Rodar o servidor
bash
Copiar código
uvicorn app.main:app --reload
A API vai estar em:

http://127.0.0.1:8000

Docs:

Swagger: http://127.0.0.1:8000/docs

ReDoc: http://127.0.0.1:8000/redoc

🔐 Fluxo de autenticação
Faça login para obter o token JWT

Use o token nas rotas protegidas:

Header

makefile
Copiar código
Authorization: Bearer SEU_TOKEN_AQUI
Exemplos de endpoints (geral)
Os paths podem variar conforme suas rotas (app/routers). Use /docs para ver os endpoints exatos.

POST /auth/login → retorna token

POST /users → cria usuário

GET /users → lista usuários

GET /users/{id} → detalha usuário

PUT /users/{id} → atualiza usuário

DELETE /users/{id} → remove usuário

Frontend
Abra o frontend/index.html no navegador e configure a URL base da API no frontend/app.js se necessário.

Se estiver rodando local:

API: http://127.0.0.1:8000

Roadmap (opcional)
 Dockerfile e docker-compose

 Testes (pytest)

 Banco via SQLAlchemy + migrations (Alembic)

 Deploy (Render/Railway/Fly.io)

📌 Observações
Este projeto foi construído para estudo e portfólio, priorizando clareza e boas práticas.

Pull requests e sugestões são bem-vindos.

Autor
Felipe Roberto
GitHub: https://github.com/feoliveirarobert