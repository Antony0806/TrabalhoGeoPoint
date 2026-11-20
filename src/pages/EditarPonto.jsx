import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { buscarPonto, atualizarPonto } from '../services/api';
import FormPonto from '../components/FormPonto';

function EditarPonto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ponto, setPonto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarPonto() {
      try {
        const dados = await buscarPonto(id);
        setPonto(dados);
      } catch (erro) {
        setErro(erro.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPonto();
  }, [id]);

  async function handleAtualizar(dados) {
    await atualizarPonto(id, dados);

    alert('Ponto atualizado com sucesso!');
    navigate('/pontos');
  }

  if (carregando) {
    return <p>Carregando ponto...</p>;
  }

  if (erro) {
    return <p role="alert">Erro: {erro}</p>;
  }

  if (!ponto) {
    return <p>Ponto não encontrado.</p>;
  }

  return (
    <section>
      <h1>Editar ponto</h1>

      <p>Altere os dados do ponto geográfico.</p>

      <FormPonto
        pontoInicial={ponto}
        onSalvar={handleAtualizar}
        textoBotao="Salvar alterações"
      />
    </section>
  );
}

export default EditarPonto