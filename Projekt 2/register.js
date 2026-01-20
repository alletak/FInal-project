const form = document.getElementById("regForm");

const passwordInput = form.querySelector('input[name="password"]');
const passwordRepeatInput = form.querySelector('input[name="passwordRepeat"]');

function setPwState(state) {
  passwordInput.classList.remove("pw-ok", "pw-error");
  passwordRepeatInput.classList.remove("pw-ok", "pw-error");

  if (state === "ok") {
    passwordInput.classList.add("pw-ok");
    passwordRepeatInput.classList.add("pw-ok");
  }

  if (state === "error") {
    passwordInput.classList.add("pw-error");
    passwordRepeatInput.classList.add("pw-error");
  }
}

function validatePasswords() {
  const pass1 = passwordInput.value;
  const pass2 = passwordRepeatInput.value;

  // 1️⃣ obě prázdné → nic nebarvit
  if (!pass1 && !pass2) {
    passwordRepeatInput.setCustomValidity("");
    setPwState("none");
    return;
  }

  // 2️⃣ jedna vyplněná, druhá ne → chyba
  if (!pass1 || !pass2) {
    passwordRepeatInput.setCustomValidity("Hesla se neshodují");
    setPwState("error");
    return;
  }

  // 3️⃣ obě vyplněné → porovnej
  if (pass1 === pass2) {
    passwordRepeatInput.setCustomValidity("");
    setPwState("ok");
  } else {
    passwordRepeatInput.setCustomValidity("Hesla se neshodují");
    setPwState("error");
  }
}

passwordInput.addEventListener("input", validatePasswords);
passwordRepeatInput.addEventListener("input", validatePasswords);

form.addEventListener("submit", (e) => {
  validatePasswords();
  if (!form.checkValidity()) {
    e.preventDefault();
  }
});
