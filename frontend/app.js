const API = "http://127.0.0.1:8000";

// ---------- ELEMENTOS ----------
const apiStatus = document.getElementById("apiStatus");

const form = document.getElementById("user-form");
const refreshBtn = document.getElementById("refreshBtn");
const usersTbody = document.getElementById("usersTbody");

// login
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");

// alert bonito
const alertBox = document.getElementById("alert");
const alertIcon = document.getElementById("alertIcon");
const alertTitle = document.getElementById("alertTitle");
const alertMessage = document.getElementById("alertMessage");

// ---------- TOKEN ----------
const TOKEN_KEY = "access_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ---------- UI HELPERS ----------
function showAlert(type, title, message) {
  // type: "success" | "error" | "info"
  alertBox.classList.remove("hidden");

  if (type === "success") {
    alertIcon.textContent = "✓";
    alertTitle.textContent = title || "Sucesso";
  } else if (type === "error") {
    alertIcon.textContent = "!";
    alertTitle.textContent = title || "Erro";
  } else {
    alertIcon.textContent = "i";
    alertTitle.textContent = title || "Info";
  }

  alertMessage.textContent = message || "";
  setTimeout(() => alertBox.classList.add("hidden"), 4500);
}

function setApiBadge(ok) {
  apiStatus.textContent = ok ? "API: online" : "API: offline";
  apiStatus.classList.toggle("ok", !!ok);
}

// ---------- FETCH HELPERS ----------
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  // adiciona token se existir
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // pode vir vazio
  }

  return { res, data };
}

function renderUsers(users) {
  if (!users || users.length === 0) {
    usersTbody.innerHTML = `<tr><td colspan="4" class="muted">Nenhum usuário cadastrado.</td></tr>`;
    return;
  }

  usersTbody.innerHTML = users
    .map(
      (u) => `
    <tr>
      <td>${u.id ?? "-"}</td>
      <td>${u.name ?? "-"}</td>
      <td>${u.email ?? "-"}</td>
      <td>${u.age ?? "-"}</td>
    </tr>`
    )
    .join("");
}

// ---------- CHECK API ----------
async function pingApi() {
  try {
    const { res } = await apiFetch("/", { method: "GET" });
    setApiBadge(res.ok);
  } catch {
    setApiBadge(false);
  }
}

// ---------- LISTAR USERS (com token) ----------
async function loadUsers() {
  usersTbody.innerHTML = `<tr><td colspan="4" class="muted">Carregando...</td></tr>`;

  const { res, data } = await apiFetch("/users", { method: "GET" });

  if (!res.ok) {
    if (res.status === 401) {
      renderUsers([]);
      showAlert("error", "Não autorizado", "Faça login para ver a lista de usuários.");
      return;
    }
    showAlert("error", `Erro (${res.status})`, data?.detail || "Falha ao buscar usuários.");
    return;
  }

  renderUsers(data);
}

// ---------- CADASTRAR USER ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = Number(document.getElementById("age").value);
  const password = document.getElementById("password").value;

  const { res, data } = await apiFetch("/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age, password }),
  });

  if (!res.ok) {
    const msg =
      data?.detail ||
      (Array.isArray(data?.detail) ? data.detail.map((d) => d.msg).join(" | ") : null) ||
      "Erro ao cadastrar.";
    showAlert("error", `Erro (${res.status})`, msg);
    return;
  }

  showAlert("success", "Cadastrado!", `Usuário ${data.name} criado com ID ${data.id}.`);

  // limpa campos
  form.reset();

  // se já estiver logado, atualiza lista
  if (getToken()) {
    loadUsers();
  }
});

// ---------- LOGIN (gera token) ----------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  loginStatus.textContent = "Entrando...";

  // OAuth2PasswordRequestForm exige x-www-form-urlencoded
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const { res, data } = await apiFetch("/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    loginStatus.textContent = "";
    showAlert("error", "Login falhou", data?.detail || "Credenciais inválidas.");
    return;
  }

  setToken(data.access_token);
  loginStatus.textContent = "Logado ✅ Token salvo.";

  showAlert("success", "Login OK", "Você já pode acessar rotas protegidas.");

  // carrega usuários agora que tem token
  loadUsers();
});

// ---------- BOTÃO ATUALIZAR ----------
refreshBtn.addEventListener("click", loadUsers);

// ---------- INIT ----------
(async function init() {
  await pingApi();

  // se já existir token salvo, tenta carregar users direto
  if (getToken()) {
    loginStatus.textContent = "Token encontrado ✅";
    loadUsers();
  } else {
    loginStatus.textContent = "Você ainda não está logado.";
    renderUsers([]);
  }
})();


