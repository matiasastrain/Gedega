// frontend/src/pages/About.jsx
import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css'; // reutilizamos estilos pastel
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="home-hero-section py-5">
      <div className="container">
        {/* misma estructura que Home, pero carrusel a la izquierda */}
        <div className="row align-items-center g-5 about-row">
          {/* IZQUIERDA: Carrusel dentro de tarjeta blanca */}
          <div className="col-lg-6">
            <div className="about-card about-carousel-card">
              <Carousel
                fade
                indicators
                controls
                interval={4000}
                className="home-carousel w-100"
              >
                <Carousel.Item>
                  <img
                    src="/images/hero-6.png"
                    className="d-block w-100 about-carousel-img"
                    alt={t('about.slide1.title')}
                  />
                  <Carousel.Caption className="home-caption">
                    <h5 className="fw-bold">{t('about.slide1.title')}</h5>
                    <p>{t('about.slide1.text')}</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    src="/images/hero-5.png"
                    className="d-block w-100 about-carousel-img"
                    alt={t('about.slide2.title')}
                  />
                  <Carousel.Caption className="home-caption">
                    <h5 className="fw-bold">{t('about.slide2.title')}</h5>
                    <p>{t('about.slide2.text')}</p>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img
                    src="/images/hero-4.png"
                    className="d-block w-100 about-carousel-img"
                    alt={t('about.slide3.title')}
                  />
                  <Carousel.Caption className="home-caption">
                    <h5 className="fw-bold">{t('about.slide3.title')}</h5>
                    <p>{t('about.slide3.text')}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>

          {/* DERECHA: Texto en tarjeta amarilla, igual estilo que Home pero un poco más chico */}
          <div className="col-lg-6">
            <div className="about-card about-text-card">
              <h1 className="home-hero-title about-hero-title fw-bold mb-3">
                {t('about.hero.title')}{' '}
                <span className="home-hero-highlight">
                  {t('about.hero.highlight')}
                </span>
              </h1>

              <p className="lead text-muted mb-3">
                {t('about.hero.text')}
              </p>

              <ul className="text-muted mb-4">
                <li>{t('about.list.item1')}</li>
                <li>{t('about.list.item2')}</li>
                <li>{t('about.list.item3')}</li>
                <li>{t('about.list.item4')}</li>
              </ul>

              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button
                  as={Link}
                  to="/"
                  className="px-4 rounded-pill home-btn-primary"
                >
                  {t('about.buttons.backHome')}
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  className="px-4 rounded-pill home-btn-outline"
                >
                  {t('about.buttons.contact')}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
