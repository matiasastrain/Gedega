import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body text-center">
            <h2>Perfil de Usuario</h2>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}