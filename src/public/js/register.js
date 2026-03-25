// ── Datos ────────────────────────────────────────────────────────────
const data = {
  systemLabel:          "Sistema de acceso v2.4",
  title:                "Crear cuenta",
  subtitle:             "Completá los datos para registrarte.",
  nameLabel:            "Nombre",
  namePlaceholder:      "Juan",
  lastNameLabel:        "Apellido",
  lastNamePlaceholder:  "Pérez",
  emailLabel:           "Correo electrónico",
  emailPlaceholder:     "usuario@dominio.com",
  usernameLabel:        "Username/NickName",
  usernamePlaceholder:  "jua45n",
  passwordLabel:        "Contraseña",
  passwordPlaceholder:  "••••••••",
  confirmLabel:         "Confirmá la contraseña",
  confirmPlaceholder:   "••••••••",
  btnText:              "Registrarse →",
  dividerText:          "¿Ya tenés cuenta?",
  loginBtnText:         "Iniciar sesión →",
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

// Campo nombre
const nameErr = el("div", { class: "field-error", id: "name-error" }, "Ingresá tu nombre");
const nameInput = el("input", {
  type: "text", id: "name", name: "name",
  placeholder: data.namePlaceholder, autocomplete: "name"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "name" }, data.nameLabel),
    nameInput,
    nameErr
  )
);
// Campo nombre
const lastNameErr = el("div", { class: "field-error", id: "lastName-error" }, "Ingresá tu apellido.");
const lastNameInput = el("input", {
  type: "text", id: "lastName", name: "lastName",
  placeholder: data.lastNamePlaceholder, autocomplete: "lastName"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "lastName" }, data.lastNameLabel),
    lastNameInput,
    lastNameErr
  )
);

// Campo username
const usernameErr = el("div", { class: "field-error", id: "username-error" }, "Ingresá tu nombre de usuario.");
const usernameInput = el("input", {
  type: "text", id: "username", name: "username",
  placeholder: data.usernamePlaceholder, autocomplete: "username"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "username" }, data.usernameLabel),
    usernameInput,
    usernameErr
  )
);

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
  placeholder: data.passwordPlaceholder, autocomplete: "new-password"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "password" }, data.passwordLabel),
    passInput,
    passErr
  )
);

// Campo confirmar contraseña
const confirmErr = el("div", { class: "field-error", id: "confirm-error" }, "Las contraseñas no coinciden.");
const confirmInput = el("input", {
  type: "password", id: "confirm", name: "confirm",
  placeholder: data.confirmPlaceholder, autocomplete: "new-password"
});
formArea.appendChild(
  el("div", { class: "field" },
    el("label", { for: "confirm" }, data.confirmLabel),
    confirmInput,
    confirmErr
  )
);

// Botón registrarse
const btnLoading  = el("span", { class: "btn-loading" }, "procesando...");
const btnText     = el("span", { class: "btn-text" }, data.btnText);
const btnRegister = el("button", { class: "btn-submit", id: "btn-register", type: "button" }, btnText, btnLoading);
formArea.appendChild(btnRegister);

// Divisor
formArea.appendChild(
  el("div", { class: "divider" }, el("span", {}, data.dividerText))
);

// Botón ir a login
const btnLogin = el("button", { class: "btn-register", id: "btn-login", type: "button" }, data.loginBtnText);
formArea.appendChild(btnLogin);

// Mensaje de éxito
const successMsg = el("div", { id: "success-msg" },
  el("div", { class: "check" }, "◆"),
  el("p", {}, "Cuenta creada"),
  el("small", {}, "Redirigiendo al ingreso...")
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

nameInput.addEventListener("input",    () => clearError(nameInput, nameErr));
emailInput.addEventListener("input",   () => clearError(emailInput, emailErr));
passInput.addEventListener("input",    () => clearError(passInput, passErr));
confirmInput.addEventListener("input", () => clearError(confirmInput, confirmErr));

btnRegister.addEventListener("click", async () => {
  let valid = true;
  const nameVal    = nameInput.value.trim();
  const lastNameVal    = lastNameInput.value.trim();
  const usernameVal    = usernameInput.value.trim();
  const emailVal   = emailInput.value.trim();
  const passVal    = passInput.value;
  const confirmVal = confirmInput.value;
  const emailRx    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearError(nameInput,    nameErr);
  clearError(emailInput,   emailErr);
  clearError(passInput,    passErr);
  clearError(confirmInput, confirmErr);

  if (nameVal.length < 2)        { showError(nameInput,    nameErr);    valid = false; }
  if (!emailRx.test(emailVal))   { showError(emailInput,   emailErr);   valid = false; }
  if (passVal.length < 6)        { showError(passInput,    passErr);    valid = false; }
  if (passVal !== confirmVal)    { showError(confirmInput, confirmErr); valid = false; }
  if (!valid) return;

  btnRegister.classList.add("loading");
  btnRegister.disabled = true;

  const req = await fetch("http://localhost:8080/api/v1/auth/register",
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          name: nameVal,
          lastName: lastNameVal,
          username: usernameVal,
          email: emailVal,
          password: passVal

        }
      )
    }
  )

  const res = await req.json();

  if(res.success){
    formArea.style.display   = "none";
    successMsg.style.display = "block";
    window.location.href = "/login";
  }

  /* setTimeout(() => {
    formArea.style.display   = "none";
    successMsg.style.display = "block";
  }, 1400); */
});

// ── Ir a login ───────────────────────────────────────────────────────
btnLogin.addEventListener("click", () => {
  window.location.href = "/login";
});