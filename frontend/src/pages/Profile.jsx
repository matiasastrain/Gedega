import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body text-center">
            <h2>{t('User Profile')}</h2>
            <p>
              <strong>{t('Username')}:</strong> {user?.username}
            </p>
            <p>
              <strong>{t('Email')}:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
