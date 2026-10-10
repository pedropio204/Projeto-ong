const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_TELEFONE = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

export function validarCampo(input) {
  const container = input.closest('.form-group') || input.parentElement;
  const valor = input.value.trim();
  let mensagemErro = '';

  if (input.hasAttribute('required') && !valor) {
    mensagemErro = 'Este campo é de preenchimento obrigatório.';
  } else if (input.type === 'email' && valor && !REGEX_EMAIL.test(valor)) {
    mensagemErro = 'Insira um e-mail válido (ex: nome@dominio.com).';
  } else if (input.type === 'tel' && valor && !REGEX_TELEFONE.test(valor)) {
    mensagemErro = 'Insira um telefone válido com DDD.';
  } else if (input.minLength && valor.length < input.minLength) {
    mensagemErro = `Mínimo de ${input.minLength} caracteres necessários.`;
  }

  if (mensagemErro) {
    exibirErroDOM(container, input, mensagemErro);
    return false;
  } else {
    removerErroDOM(container, input);
    return true;
  }
}

function exibirErroDOM(container, input, mensagem) {
  container.classList.remove('success');
  container.classList.add('error');

  let spanMsg = container.querySelector('.error-message');
  if (!spanMsg) {
    spanMsg = document.createElement('span');
    spanMsg.className = 'error-message';
    container.appendChild(spanMsg);
  }
  spanMsg.textContent = mensagem;
  input.setAttribute('aria-invalid', 'true');
}

function removerErroDOM(container, input) {
  container.classList.remove('error');
  if (input.value.trim()) {
    container.classList.add('success');
  } else {
    container.classList.remove('success');
  }

  input.setAttribute('aria-invalid', 'false');
  const spanMsg = container.querySelector('.error-message');
  if (spanMsg) spanMsg.remove();
}