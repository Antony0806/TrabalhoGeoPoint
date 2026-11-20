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
    async function carregarPontos() {
      try {
        const dados = await listarPontos();
        setPontos(dados);
      } catch (erro) {
        setErro(erro.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPontos();
  }, []);

  const pontosFiltrados = pontos.filter((ponto) =>
    ponto.name.toLowerCase().includes(filtro.toLowerCase())
  );

  async function handleExcluir(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir este ponto?'
    );

    if (!confirmar) return;

    setExcluindoId(id);
    setErro('');

    try {
      await excluirPonto(id);

      setPontos((listaAtual) =>
        listaAtual.filter((ponto) => ponto.id !== id)
      );
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <section>
      <h1>Pontos Geográficos</h1>
      <p>Consulte e gerencie os pontos cadastrados.</p>

      <Link to="/pontos/novo">
        Novo Ponto
      </Link>

      <FiltroPontos
        filtro={filtro}
        setFiltro={setFiltro}
      />

      {carregando && <p>Carregando pontos...</p>}

      {erro && <p role="alert">Erro: {erro}</p>}

      {!carregando && !erro && pontosFiltrados.length === 0 && (
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
