import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <footer className="custom-footer">
        <div className="container">
          <div className="row gy-4">
            {/* Contact */}
            <div className="col-lg-3 col-md-6">
              <h5>Contact</h5>
              <p className="text-muted small">
                <strong>Tell Us Everything</strong><br />
                Do you have any question? Feel free to reach out.
              </p>
              <Link to="/contact" className="footer-link text-primary">Let's Chat →</Link>
            </div>

            {/* Policy */}
            <div className="col-lg-3 col-md-6">
              <h5>Policy</h5>
              <Link to="#" className="footer-link">Application Security</Link>
              <Link to="#" className="footer-link">Software Principles</Link>
              <h6 className="mt-3">Support Center</h6>
              <Link to="#" className="footer-link">Customer Support</Link>
            </div>

            {/* Company */}
            <div className="col-lg-3 col-md-6">
              <h5>Company</h5>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="#" className="footer-link">Blog</Link>
              <Link to="#" className="footer-link">Press</Link>
              <Link to="#" className="footer-link">Careers & Culture</Link>
            </div>

            {/* Address + Language */}
            <div className="col-lg-3 col-md-6">
              <h5>Address</h5>
              <p className="footer-address">
                Rancho Santa Margarita<br />
                2131 Elk Street<br />
                California
              </p>
              <h6 className="mt-4">Language</h6>
              <div>
                <img src="https://flagcdn.com/us.svg" alt="EN" className="flag-icon" />
                <img src="https://flagcdn.com/es.svg" alt="ES" className="flag-icon" />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div className="row align-items-center">
            <div className="col-md-4">
              <h4 className="fw-bold text-primary mb-0">Landy</h4>
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
              <a href="https://buymeacoffee.com" target="_blank" rel="noreferrer" className="btn btn-coffee">
                <i className="bi bi-cup-hot-fill"></i> Buy me a coffee
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