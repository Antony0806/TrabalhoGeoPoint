import { Link } from 'react-router-dom';

function TabelaPontos({ pontos, onExcluir, excluindoId }) {
  return (
    <div className="tabela-container">
      <table className="tabela-pontos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.id}>
              <td>
                <Link to={`/pontos/${ponto.id}`}>
                  {ponto.name}
                </Link>
              </td>

              <td>{ponto.description || '-'}</td>
              <td>{ponto.latitude}</td>
              <td>{ponto.longitude}</td>

              <td>
                <Link to={`/pontos/${ponto.id}`}>
                  Ver
                </Link>

                {' | '}

                <Link to={`/pontos/${ponto.id}/editar`}>
                  Editar
                </Link>

                {' | '}

                <button
                  type="button"
                  onClick={() => onExcluir(ponto.id)}
                  disabled={excluindoId !== null}
                >
                  {excluindoId === ponto.id
                    ? 'Excluindo...'
                    : 'Excluir'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaPontos;