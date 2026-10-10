const routes = {
  '/': '/pages/home.html',
  '/projetos': '/pages/projetos.html',
  '/cadastro': '/pages/cadastro.html',
  '/transparencia': '/pages/transparencia.html'
};

let currentController = null;

export async function navigate(path, renderCallback) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  await renderRoute(path, renderCallback);
}

export async function renderRoute(path, renderCallback) {
  const container = document.getElementById('app-content');
  if (!container) return;

  if (currentController) {
    currentController.abort();
  }
  currentController = new AbortController();

  const viewUrl = routes[path] || routes['/'];

  try {
    const response = await fetch(viewUrl, { signal: currentController.signal });
    if (!response.ok) throw new Error('Página não encontrada');
    
    const html = await response.text();
    container.innerHTML = html;
    container.focus();

    if (renderCallback && typeof renderCallback === 'function') {
      renderCallback(path);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      container.innerHTML = '<h2>Erro 404: Conteúdo indisponível</h2>';
    }
  }
}