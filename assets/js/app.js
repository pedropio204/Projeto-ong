import { navigate, renderRoute } from './router.js';
import { validarCampo } from './validator.js';
import { salvarRegistro, obterRegistros, STORAGE_KEYS } from './storage.js';
import { criarCardProjeto, criarTabelaDoacoes } from './templates.js';

let chartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMenuMobile();
  renderRoute(window.location.pathname, handlePageInit);
});

function initNavigation() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (link) {
      e.preventDefault();
      const path = link.getAttribute('href');
      navigate(path, handlePageInit);
    }
  });

  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname, handlePageInit);
  });
}

function initMenuMobile() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('active');
    });
  }
}

function handlePageInit(path) {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (path === '/projetos' || path === '/') {
    renderProjetosSection();
  }

  if (path === '/transparencia') {
    renderTransparenciaSection();
  }

  setupFormListeners();
}

function renderProjetosSection() {
  const grid = document.getElementById('grid-projetos');
  if (!grid) return;

  const listaProjetos = [
    { titulo: 'Educação Digital', descricao: 'Inclusão digital e apoio escolar para jovens carentes.', imagem: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80' },
    { titulo: 'Horta Comunitária', descricao: 'Sustentabilidade urbana e segurança alimentar.', imagem: 'https://images.unsplash.com/photo-1595974482597-4f6c8770d456?auto=format&fit=crop&w=600&q=80' }
  ];

  grid.innerHTML = listaProjetos.map(criarCardProjeto).join('');
}

function renderTransparenciaSection() {
  const containerTabela = document.getElementById('container-doacoes');
  const canvas = document.getElementById('grafico-impacto');

  if (containerTabela) {
    const doacoes = obterRegistros(STORAGE_KEYS.DOACOES);
    const mockDoacoes = doacoes.length ? doacoes : [
      { nome: 'Ana Souza', valor: 250, categoria: 'Educação', id: Date.now() - 100000 },
      { nome: 'Carlos Lima', valor: 500, categoria: 'Sustentabilidade', id: Date.now() - 50000 }
    ];
    containerTabela.innerHTML = criarTabelaDoacoes(mockDoacoes);
  }

  if (canvas && typeof Chart !== 'undefined') {
    chartInstance = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Educação', 'Sustentabilidade', 'Saúde'],
        datasets: [{ label: 'Impacto (R$)', data: [12000, 19000, 8000], backgroundColor: '#2e7d32' }]
      },
      options: { responsive: true }
    });
  }
}

function setupFormListeners() {
  const form = document.querySelector('.app-form');
  if (!form) return;

  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
    const isFormValid = inputs.every(input => validarCampo(input));

    if (!isFormValid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());

    salvarRegistro(STORAGE_KEYS.VOLUNTARIOS, dados);

    alert('Cadastro realizado com sucesso!');
    form.reset();
    if (submitBtn) submitBtn.disabled = false;
  });
}