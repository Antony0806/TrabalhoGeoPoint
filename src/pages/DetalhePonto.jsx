import { useParams } from 'react-router-dom';

function DetalhePonto() {
  const { id } = useParams();

  return <h1>Detalhes do Ponto: {id}</h1>;
}

export default DetalhePonto;
