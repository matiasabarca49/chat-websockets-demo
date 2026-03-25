// ── Datos ────────────────────────────────────────────────────────────
const data = {
  systemLabel:         "Sistema de acceso v2.4",
  title:               "Iniciar sesión",
  subtitle:            "Ingresá tus credenciales para continuar.",
  emailLabel:          "Correo electrónico",
  emailPlaceholder:    "usuario@dominio.com",
  passwordLabel:       "Contraseña",
  passwordPlaceholder: "••••••••",
  rememberLabel:       "Recordarme",
  forgotLabel:         "¿Olvidaste tu contraseña?",
  btnText:             "Ingresar →",
  dividerText:         "¿No tenés cuenta?",
  registerBtnText:     "Crear cuenta nueva →",
};

// ── Construcción del DOM ─────────────────────────────────────────────
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class")    node.className = v;
    else if (k === "for") node.htmlFor = v;
    else                  node.setAttribute(k, v);
  }
  for (const child of children) {
    if (typeof child === "string") node.appendChild(document.createTextNode(child));
    else if (child)                node.appendChild(child);
  }
  return node;
}

const wrapper = document.getElementById("app");

// Label sistema
wrapper.appendChild(
  el("div", { class: "label-system" }, data.systemLabel)
);

// Título
const h1 = el("h1", {}, data.title);
h1.appendChild(el("span", {}, "."));
wrapper.appendChild(h1);

// Subtítulo
wrapper.appendChild(el("p", { class: "subtitle" }, data.subtitle));

// Card
const card = el("div", { class: "card" });
wrapper.appendChild(card);

// Form area
const formArea = el("div", { id: "form-area" });
card.appendChild(formArea);

// Campo email
const emailErr = el("div", { class: "field-error", id: "email-error" }, "Ingresá un correo válido.");
const emailInput = el("input", {
  type: "email", id: "email", name: "email",
  placeholder: data.emailPlaceholder, autocomplete: "email"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "email" }, data.emailLabel),
    emailInput,
    emailErr
  )
);

// Campo contraseña
const passErr = el("div", { class: "field-error", id: "password-error" }, "La contraseña debe tener al menos 6 caracteres.");
const passInput = el("input", {
  type: "password", id: "password", name: "password",
  placeholder: data.passwordPlaceholder, autocomplete: "current-password"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "password" }, data.passwordLabel),
    passInput,
    passErr
  )
);

// Fila opciones: recordarme + olvidé contraseña
const checkbox = el("input", { type: "checkbox", id: "remember" });
const rememberLabel = el("label", { class: "remember", for: "remember" });
rememberLabel.appendChild(checkbox);
rememberLabel.appendChild(document.createTextNode(" " + data.rememberLabel));

formArea.appendChild(
  el("div", { class: "row-options" },
    rememberLabel,
    el("a", { href: "#", class: "forgot" }, data.forgotLabel)
  )
);

// Botón ingresar
const btnLoading = el("span", { class: "btn-loading" }, "procesando...");
const btnText    = el("span", { class: "btn-text" }, data.btnText);
const btnLogin   = el("button", { class: "btn-submit", id: "btn-login", type: "button" }, btnText, btnLoading);
formArea.appendChild(btnLogin);

// Divisor
formArea.appendChild(
  el("div", { class: "divider" }, el("span", {}, data.dividerText))
);

// Botón registro
const btnRegister = el("button", { class: "btn-register", id: "btn-register", type: "button" }, data.registerBtnText);
formArea.appendChild(btnRegister);

// Mensaje de éxito
const successMsg = el("div", { id: "success-msg" },
  el("div", { class: "check" }, "◆"),
  el("p", {}, "Acceso concedido"),
  el("small", {}, "Redirigiendo al sistema...")
);
card.appendChild(successMsg);

// ── Validación ───────────────────────────────────────────────────────
function clearError(input, errEl) {
  input.classList.remove("error");
  errEl.classList.remove("visible");
}

function showError(input, errEl) {
  input.classList.add("error");
  errEl.classList.add("visible");
}

emailInput.addEventListener("input", () => clearError(emailInput, emailErr));
passInput.addEventListener("input",  () => clearError(passInput, passErr));


btnLogin.addEventListener("click", async () => {
  let valid = true;
  const emailVal = emailInput.value.trim();
  const passVal  = passInput.value;
  const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearError(emailInput, emailErr);
  clearError(passInput, passErr);

  if (!emailRx.test(emailVal)) { showError(emailInput, emailErr); valid = false; }
  if (passVal.length < 6)      { showError(passInput, passErr);   valid = false; }
  if (!valid) return;

  btnLogin.classList.add("loading");
  btnLogin.disabled = true;

  const req = await fetch("http://localhost:8080/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          email: emailVal,
          password: passVal

        }
      )
    }
  )

  const res = await req.json();

  if(res.success){
    localStorage.setItem("autor", JSON.stringify(res.data));
    localStorage.setItem("idChat", res.data.id);
    formArea.style.display  = "none";
    successMsg.style.display = "block";
    window.location.href = "/";
  }
});

// ── Ir a registro ────────────────────────────────────────────────────
btnRegister.addEventListener("click", () => {
  window.location.href = "/register";
});