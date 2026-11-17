import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h2>GeoPoint</h2>

      <div className="nav-links">
        <Link to="/pontos">Listagem</Link>
        <Link to="/pontos/novo">Cadastrar</Link>
      </div>
    </nav>
  );
}

export default Navbar;
