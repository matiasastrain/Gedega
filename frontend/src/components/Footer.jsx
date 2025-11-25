// frontend/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isEs = i18n.language.startsWith('es');
  const isEn = i18n.language.startsWith('en');

  return (
    <>
      <footer className="custom-footer">
        <div className="container">
          <div className="row gy-4">
            {/* Contact */}
            <div className="col-lg-3 col-md-6">
              <h5>{t('Contact')}</h5>
              <p className="text-muted small">
                <strong>{t('Tell Us Everything')}</strong><br />
                {t('Do you have any question? Feel free to reach out.')}
              </p>
              <Link to="/contact" className="footer-link text-primary">
                {t("Let's Chat →")}
              </Link>
            </div>

{/* Policy */}
<div className="col-lg-3 col-md-6">
  <h5>{t('Policy')}</h5>
  <Link to="/about" className="footer-link">
    {t('Application Security')}
  </Link>
  <Link to="/about" className="footer-link">
    {t('Software Principles')}
  </Link>
  <h6 className="mt-3">{t('Support Center')}</h6>
  <Link to="/about" className="footer-link">
    {t('Customer Support')}
  </Link>
</div>

{/* Company */}
<div className="col-lg-3 col-md-6">
  <h5>{t('Company')}</h5>
  <Link to="/about" className="footer-link">
    {t('About')}
  </Link>
  <Link to="/about" className="footer-link">
    {t('Blog')}
  </Link>
  <Link to="/about" className="footer-link">
    {t('Press')}
  </Link>
  <Link to="/about" className="footer-link">
    {t('Careers & Culture')}
  </Link>
</div>


            {/* Address + Language */}
            <div className="col-lg-3 col-md-6">
              <h5>{t('Address')}</h5>
              <p className="footer-address">
                Universidad Adolfo Ibañez
              </p>

              <h6 className="mt-4">{t('Language')}</h6>
              <div className="d-flex align-items-center gap-2">
                {/* EN flag */}
                <button
                  type="button"
                  onClick={() => changeLanguage('en')}
                  className="border-0 p-0 bg-transparent"
                  aria-label="English"
                >
                  <img
                    src="https://flagcdn.com/us.svg"
                    alt="English"
                    className="flag-icon"
                    style={{
                      opacity: isEn ? 1 : 0.4,
                      transform: isEn ? 'scale(1.05)' : 'scale(1.0)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </button>

                {/* ES flag */}
                <button
                  type="button"
                  onClick={() => changeLanguage('es')}
                  className="border-0 p-0 bg-transparent"
                  aria-label="Español"
                >
                  <img
                    src="https://flagcdn.com/es.svg"
                    alt="Español"
                    className="flag-icon"
                    style={{
                      opacity: isEs ? 1 : 0.4,
                      transform: isEs ? 'scale(1.05)' : 'scale(1.0)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="row align-items-center">
            <div className="col-md-4">
              <h4 className="fw-bold text-primary mb-0">GeoDy</h4>
            </div>
            <div className="col-md-4 text-center">
              <div className="social-links d-flex justify-content-center">
                <a href="#"><i className="bi bi-github"></i></a>
                <a href="#"><i className="bi bi-twitter"></i></a>
                <a href="#"><i className="bi bi-linkedin"></i></a>
                <a href="#"><i className="bi bi-medium"></i></a>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-coffee"
              >
                <i className="bi bi-cup-hot-fill"></i> {t('Buy me a coffee')}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button onClick={scrollToTop} className="scroll-top">
        <i className="bi bi-arrow-up"></i>
      </button>
    </>
  );
}
