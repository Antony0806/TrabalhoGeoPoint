function FiltroPontos({ filtro, setFiltro }) {
  return (
    <div className="filtro-pontos">
      <label htmlFor="filtro">
        Buscar ponto
      </label>

      <input
        id="filtro"
        type="text"
        placeholder="Digite o nome do ponto..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
    </div>
  );
}

export default FiltroPontos;