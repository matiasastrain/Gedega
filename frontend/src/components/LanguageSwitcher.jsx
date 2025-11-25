// frontend/src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        {i18n.language.toUpperCase()}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => changeLanguage('es')}>
          Español
        </Dropdown.Item>
        <Dropdown.Item onClick={() => changeLanguage('en')}>
          English
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
