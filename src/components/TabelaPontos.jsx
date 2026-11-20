import { Link } from 'react-router-dom';

function TabelaPontos({ pontos, onExcluir, excluindoId }) {
  return (
    <div className="tabela-container" role="region"
      aria-label="Tabela de pontos geográficos" tabIndex={0}>
      <table className="tabela-pontos">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Descrição</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.id}>
              <td>
                <Link to={`/pontos/${ponto.id}`}>{ponto.name}</Link>
              </td>
              <td>{ponto.description || '—'}</td>
              <td>{ponto.latitude}</td>
              <td>{ponto.longitude}</td>
              <td>
                <div className="acoes-tabela">
                  <Link className="acao-tabela" to={`/pontos/${ponto.id}`}>
                    Ver
                  </Link>
                  <Link className="acao-tabela" to={`/pontos/${ponto.id}/editar`}>
                    Editar
                  </Link>
                  <button type="button" className="acao-tabela acao-excluir"
                    onClick={() => onExcluir(ponto.id)}
                    disabled={excluindoId !== null}>
                    {excluindoId === ponto.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaPontos;