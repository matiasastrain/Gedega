import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <section className="home-hero-section py-5">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* IZQUIERDA: Título + Texto + Botones */}
          <div className="col-lg-6">
            <div className="home-hero-title-box">
              <h1 className="home-hero-title display-3 fw-bold mb-4">
                Landing page<br />
                <span className="text-dark">template for</span><br />
                <span className="home-hero-highlight">developers & startups</span>
              </h1>
            </div>

            <p className="lead text-muted mb-5">
              Beautifully designed templates using React.js, ant design and styled-components! 
              Save weeks of time and build your landing page in minutes.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3">
              <Button as={Link} to="/contact" variant="primary" size="lg" className="px-5 rounded-pill home-btn-primary">
                Explore
              </Button>
              <Button as={Link} to="/about" variant="outline-secondary" size="lg" className="px-5 rounded-pill home-btn-outline">
                Learn more
              </Button>
            </div>
          </div>

          {/* DERECHA: Carrusel COMPLETO */}
          <div className="col-lg-6">
            <Carousel 
              fade 
              indicators={true} 
              controls={true} 
              interval={3000}
              className="home-carousel"
            >
              {/* Slide 1 */}
              <Carousel.Item>
                <img
                  src="/images/hero-1.png"
                  className="d-block w-100 rounded-3 shadow-lg"
                  alt="Desarrollo Web Moderno"
                  style={{ height: '380px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="home-caption">
                  <h5 className="fw-bold">Desarrollo Web Moderno</h5>
                  <p>React, Node.js, Docker, JWT</p>
                </Carousel.Caption>
              </Carousel.Item>

              {/* Slide 2 */}
              <Carousel.Item>
                <img
                  src="/images/hero-2.png"
                  className="d-block w-100 rounded-3 shadow-lg"
                  alt="Para Startups"
                  style={{ height: '380px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="home-caption">
                  <h5 className="fw-bold">Para Startups</h5>
                  <p>Lanza tu MVP en días</p>
                </Carousel.Caption>
              </Carousel.Item>

              {/* Slide 3 */}
              <Carousel.Item>
                <img
                  src="/images/hero-3.png"
                  className="d-block w-100 rounded-3 shadow-lg"
                  alt="Código Limpio"
                  style={{ height: '380px', objectFit: 'cover' }}
                />
                <Carousel.Caption className="home-caption">
                  <h5 className="fw-bold">Código Limpio</h5>
                  <p>Arquitectura modular y escalable</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}