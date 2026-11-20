import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { buscarPonto, excluirPonto } from '../services/api';

function DetalhePonto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ponto, setPonto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarPonto() {
      setCarregando(true);
      setErro('');
      setPonto(null);

      try {
        const dados = await buscarPonto(id);

        if (ativo) {
          setPonto(dados);
        }
      } catch (erro) {
        if (ativo) {
          setErro(erro.message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPonto();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function handleExcluir() {
    const confirmar = window.confirm(
      'Deseja realmente excluir este ponto?'
    );

    if (!confirmar) return;

    setExcluindo(true);
    setErro('');

    try {
      await excluirPonto(id);

      alert('Ponto excluído com sucesso!');
      navigate('/pontos');
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return <p>Carregando detalhes do ponto...</p>;
  }

  if (!ponto) {
    return (
      <section>
        <h1>Detalhes do ponto</h1>
        <p role={erro ? 'alert' : undefined}>
          {erro || 'Ponto não encontrado.'}
        </p>
        <Link to="/pontos">Voltar para a lista</Link>
      </section>
    );
  }

  return (
    <section className="detalhe-ponto">
      <h1>Detalhes do ponto</h1>

      <p>
        <strong>Nome:</strong> {ponto.name}
      </p>

      <p>
        <strong>Descrição:</strong>{' '}
        {ponto.description || 'Sem descrição'}
      </p>

      <p>
        <strong>Latitude:</strong> {ponto.latitude}
      </p>

      <p>
        <strong>Longitude:</strong> {ponto.longitude}
      </p>

      {erro && <p role="alert">Erro: {erro}</p>}

      <div className="acoes-detalhe">
        <Link to={`/pontos/${id}/editar`}>
          Editar
        </Link>

        <button
          type="button"
          onClick={handleExcluir}
          disabled={excluindo}
        >
          {excluindo ? 'Excluindo...' : 'Excluir'}
        </button>

        <Link to="/pontos">
          Voltar
        </Link>
      </div>
    </section>
  );
}

export default DetalhePonto;