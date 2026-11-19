const API_URL = 'https://geopoint-6x4u.onrender.com/api/points';

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}: ${resposta.statusText}`;
    try {
      const erro = await resposta.json();
      mensagem = erro.message || erro.mensagem || mensagem;
    } catch {
    }
    throw new Error(mensagem);
  }

  if (resposta.status === 204) return null;
  if (resposta.status === 205) return null;
  return resposta.json();
}

export const listarPontos = () => requisicao(API_URL);

export const buscarPonto = (id) =>
  requisicao(`${API_URL}/${encodeURIComponent(id)}`);

export const criarPonto = (dados) =>
  requisicao(API_URL, {
    method: 'POST',
    body: JSON.stringify(dados),
  });

export const atualizarPonto = (id, dados) =>
  requisicao(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });

export const excluirPonto = (id) =>
  requisicao(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
