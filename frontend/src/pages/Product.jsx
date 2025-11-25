import { useTranslation } from 'react-i18next';

export default function Product() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-5">
      <h1 className="display-5 fw-bold text-primary">
        {t('Our Product')}
      </h1>
      <p className="lead mt-3">
        {t('GeoDy: the platform that connects ideas with impact.')}
      </p>
    </div>
  );
}
