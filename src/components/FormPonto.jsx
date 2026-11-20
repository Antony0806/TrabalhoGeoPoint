import { useState } from 'react';
import { Link } from 'react-router-dom';

function FormPonto({ pontoInicial, onSalvar, textoBotao }) {
  const [nome, setNome] = useState(pontoInicial?.name || '');
  const [descricao, setDescricao] = useState(pontoInicial?.description || '');
  const [latitude, setLatitude] = useState(pontoInicial?.latitude ?? '');
  const [longitude, setLongitude] = useState(pontoInicial?.longitude ?? '');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (salvando) return;
    setErro('');

    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      setErro('O nome é obrigatório.');
      return;
    }
    if (nomeLimpo.length > 100) {
      setErro('O nome deve ter no máximo 100 caracteres.');
      return;
    }
    if (descricao.length > 255) {
      setErro('A descrição deve ter no máximo 255 caracteres.');
      return;
    }
    if (latitude === '' || longitude === '') {
      setErro('Preencha a latitude e a longitude.');
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setErro('A latitude deve estar entre -90 e 90.');
      return;
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setErro('A longitude deve estar entre -180 e 180.');
      return;
    }

    const dados = {
      name: nomeLimpo,
      description: descricao.trim(),
      latitude: lat,
      longitude: lng,
    };

    try {
      setSalvando(true);
      await onSalvar(dados);
    } catch (erro) {
      setErro(erro.message || 'Não foi possível salvar o ponto.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nome">Nome *</label>
        <input id="nome" type="text" value={nome}
          onChange={(e) => setNome(e.target.value)} maxLength={100} required />
      </div>
      <div>
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" value={descricao}
          onChange={(e) => setDescricao(e.target.value)} maxLength={255} />
      </div>
      <div>
        <label htmlFor="latitude">Latitude *</label>
        <input id="latitude" type="number" step="any" min="-90" max="90"
          value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="longitude">Longitude *</label>
        <input id="longitude" type="number" step="any" min="-180" max="180"
          value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
      </div>

      {erro && <p role="alert">{erro}</p>}
      <div className="acoes-formulario">
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : textoBotao}
        </button>
        <Link to="/pontos" className="botao botao-secundario">Cancelar</Link>
      </div>
    </form>
  );
}

export default FormPonto;
