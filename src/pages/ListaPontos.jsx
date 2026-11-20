import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { listarPontos, excluirPonto } from '../services/api';
import TabelaPontos from '../components/TabelaPontos';
import FiltroPontos from '../components/FiltroPontos';

function ListaPontos() {
  const [pontos, setPontos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindoId, setExcluindoId] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregarPontos() {
      try {
        const dados = await listarPontos();
        if (!Array.isArray(dados)) {
          throw new Error('A API retornou uma lista em formato inesperado.');
        }
        if (ativo) setPontos(dados);
      } catch (erro) {
        if (ativo) setErro(erro.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPontos();
    return () => { ativo = false; };
  }, []);

  const pontosFiltrados = pontos.filter((ponto) =>
    (ponto.name || '').toLowerCase().includes(filtro.toLowerCase())
  );

  async function handleExcluir(id) {
    if (excluindoId !== null) return;
    if (!window.confirm('Deseja realmente excluir este ponto?')) return;
    setExcluindoId(id);
    setErro('');

    try {
      await excluirPonto(id);
      setPontos((atuais) => atuais.filter((ponto) => ponto.id !== id));
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <section className="pagina-lista">
      <div className="cabecalho-pagina">
        <div>
          <h1>Pontos geográficos</h1>
          <p>Consulte e gerencie os pontos cadastrados.</p>
        </div>
        <Link className="botao" to="/pontos/novo">+ Novo ponto</Link>
      </div>

      <FiltroPontos filtro={filtro} setFiltro={setFiltro} />

      {carregando && <p role="status">Carregando pontos...</p>}
      {erro && <p role="alert">Erro: {erro}</p>}
      {!carregando && pontosFiltrados.length === 0 && !erro && (
        <p>Nenhum ponto encontrado.</p>
      )}
      {!carregando && pontosFiltrados.length > 0 && (
        <TabelaPontos
          pontos={pontosFiltrados}
          onExcluir={handleExcluir}
          excluindoId={excluindoId}
        />
      )}
    </section>
  );
}

export default ListaPontos;