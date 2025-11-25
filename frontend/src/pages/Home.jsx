// frontend/src/pages/Home.jsx
import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();

  return (
    <section className="home-hero-section py-5">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* IZQUIERDA: Título + Texto + Botones */}
          <div className="col-lg-6">
            <div className="home-hero-title-box">
              {/* QUITAMOS display-3 y dejamos solo nuestra clase */}
              <h1 className="home-hero-title fw-bold mb-4">
                {t('home.title.line1')}<br />
                <span className="text-dark">{t('home.title.line2')}</span><br />
                <span className="home-hero-highlight">
                  {t('home.title.line3')}
                </span>
              </h1>
            </div>

            <p className="lead text-muted mb-5">
              {t('home.subtitle')}
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3">
              <Button
                as={Link}
                to="/about"
                variant="primary"
                size="lg"
                className="px-5 rounded-pill home-btn-primary"
              >
                {t('home.cta.demo')}
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline-secondary"
                size="lg"
                className="px-5 rounded-pill home-btn-outline"
              >
                {t('home.cta.learn')}
              </Button>
            </div>
          </div>

          {/* DERECHA: Carrusel */}
          <div className="col-lg-6">
            <div className="about-card about-carousel-card">
              <Carousel
                fade
                indicators
                controls
                interval={3500}
                className="home-carousel w-100"
              >
                {/* Slide 1: Inventario */}
                <Carousel.Item>
                  <img
                    src="/images/hero-1.png"
                    className="d-block w-100 rounded-3 shadow-lg home-hero-img"
                    alt={t('home.slide1.title')}
                  />
                  <Carousel.Caption className="home-caption">
                    <h5 className="fw-bold">{t('home.slide1.title')}</h5>
                    <p>{t('home.slide1.text')}</p>
                  </Carousel.Caption>
                </Carousel.Item>

                {/* Slide 2 */}
                <Carousel.Item>
                  <img
                    src="/images/hero-2.png"
                    className="d-block w-100 rounded-3 shadow-lg home-hero-img"
                    alt={t('home.slide2.title')}
                  />
                  <Carousel.Caption className="home-caption">
                    <h5 className="fw-bold">{t('home.slide2.title')}</h5>
                    <p>{t('home.slide2.text')}</p>
                  </Carousel.Caption>
                </Carousel.Item>

                {/* Slide 3 */}
                <Carousel.Item>
                  <img
                    src="/images/hero-3.png"
                    className="d-block w-100 rounded-3 shadow-lg home-hero-img"
                    alt={t('home.slide3.title')}
                  />
                  <Carousel.Caption className="home-caption">
                    <h5 className="fw-bold">{t('home.slide3.title')}</h5>
                    <p>{t('home.slide3.text')}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
