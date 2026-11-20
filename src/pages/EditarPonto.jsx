import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { buscarPonto, atualizarPonto } from '../services/api';
import FormPonto from '../components/FormPonto';

function EditarPonto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ponto, setPonto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErro('');
    setPonto(null);

    async function carregarPonto() {
      try {
        const dados = await buscarPonto(id);
        if (ativo) setPonto(dados);
      } catch (erro) {
        if (ativo) setErro(erro.message);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPonto();
    return () => { ativo = false; };
  }, [id]);

  async function handleAtualizar(dados) {
    await atualizarPonto(id, dados);
    navigate(`/pontos/${id}`);
  }

  if (carregando) return <p role="status">Carregando ponto...</p>;

  if (erro || !ponto) {
    return (
      <section>
        <h1>Editar ponto</h1>
        <p role={erro ? 'alert' : undefined}>
          {erro || 'Ponto não encontrado.'}
        </p>
        <Link className="botao botao-secundario" to="/pontos">Voltar à lista</Link>
      </section>
    );
  }

  return (
    <section className="pagina-formulario">
      <h1>Editar ponto</h1>
      <p>Altere os dados e salve para atualizar o ponto geográfico.</p>
      <FormPonto
        key={id}
        pontoInicial={ponto}
        onSalvar={handleAtualizar}
        textoBotao="Salvar alterações"
      />
    </section>
  );
}

export default EditarPonto;
