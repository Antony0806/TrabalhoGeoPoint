const API_URL = 'https://geopoint-6x4u.onrender.com/api/points';

async function requisicao(url, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(url, {
      ...opcoes,
      headers: {
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error('Não foi possível conectar à GeoPoint API. Verifique sua conexão.');
  }

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}: ${resposta.statusText || 'requisição não concluída'}`;
    try {
      const erro = await resposta.json();
      mensagem = erro.message || erro.mensagem || mensagem;
    } catch {
      // A API pode não devolver JSON quando ocorre um erro.
    }
    throw new Error(mensagem);
  }

  if (resposta.status === 204 || resposta.status === 205) return null;
  return resposta.json();
}

export const listarPontos = () => requisicao(API_URL);

export const buscarPonto = (id) =>
  requisicao(`${API_URL}/${encodeURIComponent(id)}`);

export const criarPonto = (dados) =>
  requisicao(API_URL, { method: 'POST', body: JSON.stringify(dados) });

export const atualizarPonto = (id, dados) =>
  requisicao(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });

export const excluirPonto = (id) =>
  requisicao(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' });
