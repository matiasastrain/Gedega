export default function About() {
  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        <div className="card border-0 shadow">
          <div className="card-body p-5">
            <h1 className="display-5 fw-bold text-primary">Sobre Nosotros</h1>
            <p className="lead">
              Esta es una app de ejemplo construida con:
            </p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">React 18</li>
              <li className="list-group-item">React Router DOM v6</li>
              <li className="list-group-item">Bootstrap 5</li>
            </ul>
            <div className="mt-4">
              <a href="https://react.dev" className="btn btn-outline-primary me-2">
                React Docs
              </a>
              <a href="https://getbootstrap.com" className="btn btn-outline-secondary">
                Bootstrap
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}