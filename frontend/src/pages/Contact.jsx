export default function Contact() {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Contáctanos</h2>
        <p className="card-text">
          Envíanos un email a: <strong>contacto@miapp.com</strong>
        </p>
        <form>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}