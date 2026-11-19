function Mensagem({ tipo = 'info', children }) {
  return <div className={`message message-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>{children}</div>;
}
export default Mensagem;
