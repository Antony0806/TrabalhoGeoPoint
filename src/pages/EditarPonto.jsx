import { useParams } from 'react-router-dom';

function EditarPonto() {
  const { id } = useParams();

  return <h1>Editar Ponto: {id}</h1>;
}

export default EditarPonto;
