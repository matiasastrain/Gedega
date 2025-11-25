import { useTranslation } from 'react-i18next';

export default function Mission() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-5">
      <h1 className="display-5 fw-bold text-primary">
        {t('Our Mission')}
      </h1>
      <p className="lead mt-3">
        {t('Build the future with accessible technology and human design.')}
      </p>
    </div>
  );
}
