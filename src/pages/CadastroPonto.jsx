
import { useNavigate } from 'react-router-dom';
import { criarPonto } from '../services/api';
import FormPonto from '../components/FormPonto';

function CadastroPonto() {
  const navigate = useNavigate();

  async function handleCadastrar(dados) {
    await criarPonto(dados);

    alert('Ponto cadastrado com sucesso!');
    navigate('/pontos');
  }

  return (
    <section>
      <h1>Cadastrar novo ponto</h1>

      <p>Preencha os dados do ponto geográfico.</p>

      <FormPonto
        onSalvar={handleCadastrar}
        textoBotao="Cadastrar ponto"
      />
    </section>
  );
}

export default CadastroPonto;
