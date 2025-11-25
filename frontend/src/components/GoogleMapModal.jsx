// frontend/src/components/GoogleMapModal.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';

const mapContainerStyle = {
  height: '400px',
  width: '100%'
};

const center = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires por defecto

export default function GoogleMapModal({
  show,
  onHide,
  direccion,
  onAddressSelect
}) {
  const { t } = useTranslation();

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef();

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const searchAddress = (address) => {
    if (!map) return;
    if (!window.google?.maps?.Geocoder) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        setSuggestions(results);
        setMarkers(
          results.map((r) => ({
            lat: r.geometry.location.lat(),
            lng: r.geometry.location.lng(),
            place: r.formatted_address
          }))
        );
      }
    });
  };

  const selectAddress = (place) => {
    onAddressSelect(place);
    onHide();
  };

  useEffect(() => {
    if (direccion && map) {
      searchAddress(direccion);
    }
  }, [direccion, map]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('Validate Address')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoadScript googleMapsApiKey="TU_API_KEY_AQUI">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker}
                onClick={() => selectAddress(marker.place)}
              />
            ))}
          </GoogleMap>
        </LoadScript>

        {suggestions.length > 0 && (
          <div className="mt-3">
            <h6>{t('Suggestions')}:</h6>
            <ul className="list-unstyled">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="p-2 border rounded mb-2">
                  <button
                    className="btn btn-link p-0 text-start w-100"
                    onClick={() =>
                      selectAddress(suggestion.formatted_address)
                    }
                  >
                    {suggestion.formatted_address}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('Cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
