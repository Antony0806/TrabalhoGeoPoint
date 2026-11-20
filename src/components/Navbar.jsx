import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navegação principal">
      <div className="navbar-interno">
        <Link className="marca" to="/pontos">GeoPoints</Link>
        <div className="nav-links">
          <NavLink to="/pontos" end>Pontos</NavLink>
          <NavLink to="/pontos/novo">Cadastrar</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
