export function criarCardProjeto(projeto) {
  return `
    <article class="card-project">
      <img src="${projeto.imagem}" alt="${projeto.titulo}" class="card-img" loading="lazy">
      <div class="card-body">
        <h3 class="card-title">${projeto.titulo}</h3>
        <p class="card-text">${projeto.descricao}</p>
        <a href="/cadastro" class="btn btn-primary" data-link>Seja Voluntário</a>
      </div>
    </article>
  `;
}

export function criarTabelaDoacoes(doacoes) {
  if (!doacoes || doacoes.length === 0) {
    return `<p class="empty-msg">Nenhuma doação registrada até o momento.</p>`;
  }

  const linhas = doacoes.map(d => `
    <tr>
      <td>${d.nome || 'Anônimo'}</td>
      <td>R$ ${parseFloat(d.valor || 150).toFixed(2)}</td>
      <td>${d.categoria || 'Geral'}</td>
      <td>${new Date(d.id).toLocaleDateString('pt-BR')}</td>
    </tr>
  `).join('');

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Doador</th>
          <th>Valor</th>
          <th>Destino</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
  `;
}