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
    setCarregando(true);
    setPonto(null);
    setErro('');

    async function carregarPonto() {
      try {
        const dados = await buscarPonto(id);
        if (ativo) setPonto(dados);
      } catch (err) {
        if (ativo) setErro(err.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPonto();
    return () => { ativo = false; };
  }, [id]);

  async function handleExcluir() {
    if (excluindo) return;
    if (!window.confirm('Deseja realmente excluir este ponto?')) return;
    setExcluindo(true);
    setErro('');

    try {
      await excluirPonto(id);
      navigate('/pontos');
    } catch (err) {
      setErro(err.message);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) return <p role="status">Carregando detalhes...</p>;
  if (!ponto) {
    return (
      <section>
        <h1>Detalhes do ponto</h1>
        <p role={erro ? 'alert' : undefined}>{erro || 'Ponto não encontrado.'}</p>
        <Link to="/pontos">Voltar à lista</Link>
      </section>
    );
  }

  const latitude = Number(ponto.latitude);
  const longitude = Number(ponto.longitude);
  const coordenadasValidas = Number.isFinite(latitude) && Number.isFinite(longitude)
    && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  const paramsMapa = new URLSearchParams({
    bbox: `${Math.max(-180, longitude - 0.018)},${Math.max(-90, latitude - 0.012)},${Math.min(180, longitude + 0.018)},${Math.min(90, latitude + 0.012)}`,
    layer: 'mapnik',
    marker: `${latitude},${longitude}`,
  });
  const mapaUrl = `https://www.openstreetmap.org/export/embed.html?${paramsMapa}`;
  const urlMapaExterno = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <section className="detalhe-ponto">
      <h1>Detalhes do ponto</h1>
      <p>Informações do ponto geográfico cadastrado.</p>

      <div className="dados-ponto">
        <div className="dado-ponto largura-total">
          <span className="rotulo">Nome</span>
          <strong className="valor">{ponto.name}</strong>
        </div>
        <div className="dado-ponto largura-total">
          <span className="rotulo">Descrição</span>
          <span className="valor">{ponto.description || 'Sem descrição'}</span>
        </div>
        <div className="dado-ponto">
          <span className="rotulo">Latitude</span>
          <span className="valor">{ponto.latitude}</span>
        </div>
        <div className="dado-ponto">
          <span className="rotulo">Longitude</span>
          <span className="valor">{ponto.longitude}</span>
        </div>
      </div>

      <div className="acoes-detalhe">
        <Link className="botao" to={`/pontos/${id}/editar`}>Editar ponto</Link>
        <button type="button" className="botao-perigo" onClick={handleExcluir} disabled={excluindo}>
          {excluindo ? 'Excluindo...' : 'Excluir ponto'}
        </button>
        <Link className="botao botao-secundario" to="/pontos">Voltar</Link>
      </div>
      {erro && <p role="alert">Erro: {erro}</p>}

      {coordenadasValidas && (
        <div className="mapa-detalhe">
          <iframe title={`Localização de ${ponto.name}`} src={mapaUrl} loading="lazy" />
          <div className="rodape-mapa">
            <a href={urlMapaExterno} target="_blank" rel="noopener noreferrer">
              Abrir localização no OpenStreetMap
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

export default DetalhePonto;