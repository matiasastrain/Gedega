// frontend/src/pages/roles/BetaHome.jsx
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import {
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  InputGroup
} from 'react-bootstrap';
import { GoogleMap, Marker } from '@react-google-maps/api';
import API from '../../services/api';
import { useTranslation } from 'react-i18next';

const mapContainerStyle = { height: '300px', width: '100%' };

export default function BetaHome() {
  const { t } = useTranslation();

  const [despachos, setDespachos] = useState([]);
  const [selected, setSelected] = useState(null); // para tomar / mapa
  const [showMap, setShowMap] = useState(false);
  const [camion, setCamion] = useState('');
  const [showDetails, setShowDetails] = useState(null);
  const [vista, setVista] = useState('pendientes'); // 'pendientes' | 'mis_despachos'

  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  const [mapLocation, setMapLocation] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');

  // ============= CARGA DE DESPACHOS =============
  // Ahora recibe la vista y decide si llama a /despachos o /despachos/my
  const fetchDespachos = useCallback(async (vistaActual) => {
    try {
      const endpoint =
        vistaActual === 'mis_despachos' ? '/despachos/my' : '/despachos';

      const { data } = await API.get(endpoint);
      setDespachos(Array.isArray(data) ? data : []);
      console.log('Cargados despachos desde', endpoint, data);
    } catch (error) {
      console.error('Error al cargar despachos:', error);
      alert('Error al cargar despachos. Revisa tu conexión.');
    }
  }, []);

  useEffect(() => {
    // carga inicial + recarga cada 10s según la vista actual
    const load = () => fetchDespachos(vista);
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [fetchDespachos, vista]);

  // ============= PROCESAR (BUSCAR / FILTRAR / ORDENAR) =============
  const processedDespachos = useMemo(() => {
    let result = [...despachos];

    // 1) Filtrado por vista (pendientes vs mis despachos)
    if (vista === 'pendientes') {
      result = result.filter((d) => d.estado === 'pendiente');
    } else if (vista === 'mis_despachos') {
      result = result.filter((d) => d.estado !== 'pendiente');
    }

    // 2) Búsqueda por texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.id?.toString().includes(term) ||
          d.cliente?.toLowerCase().includes(term) ||
          d.boleta?.toLowerCase().includes(term)
      );
    }

    // 3) Filtro por estado (select)
    if (estadoFilter !== 'todos') {
      result = result.filter((d) => d.estado === estadoFilter);
    }

    // 4) Ordenamiento
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'id') {
          aVal = parseInt(aVal) || 0;
          bVal = parseInt(bVal) || 0;
        } else {
          aVal = (aVal ?? '').toString().toLowerCase();
          bVal = (bVal ?? '').toString().toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [despachos, searchTerm, estadoFilter, sortConfig, vista]);

  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  // ============= TOMAR / SALIR =============
  const tomarDespacho = async () => {
    if (!selected || !camion.trim()) return;

    try {
      await API.put(`/despachos/${selected.id}/tomar`, {
        camion: camion.trim()
      });
      setSelected(null);
      setCamion('');
      // Después de tomar, recargamos y vamos a "Mis Despachos"
      await fetchDespachos('mis_despachos');
      handleCambiarVista('mis_despachos');
    } catch (error) {
      const msg =
        error.response?.data?.error || 'Error al tomar despacho';
      alert(msg);
    }
  };

  const salirDespacho = async (id) => {
    if (!window.confirm('¿Salir de este despacho?')) return;
    try {
      await API.put(`/despachos/${id}/salir`);
      await fetchDespachos('mis_despachos');
    } catch (error) {
      console.error(error);
      alert('Error al salir del despacho');
    }
  };

  const handleCambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    setSearchTerm('');
    setEstadoFilter('todos');
    // recarga inmediatamente según la nueva vista
    fetchDespachos(nuevaVista);
  };

  // ============= MAPA =============
  const handleVerMapa = (despacho) => {
    setSelected(despacho);
    setShowMap(true);
    setGeoError('');
    setMapLocation(null);

    if (despacho.lat && despacho.lng) {
      setMapLocation({
        lat: parseFloat(despacho.lat),
        lng: parseFloat(despacho.lng)
      });
      return;
    }

    if (!window.google?.maps?.Geocoder) {
      setGeoError('Google Maps no está disponible.');
      return;
    }

    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: despacho.direccion || '' },
      (results, status) => {
        setIsGeocoding(false);
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          const coords = { lat: loc.lat(), lng: loc.lng() };
          setMapLocation(coords);
        } else {
          setGeoError('No se encontró la dirección.');
        }
      }
    );
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setSelected(null);
    setMapLocation(null);
    setGeoError('');
  };

  // ============= RENDER =============
  return (
    <div className="container py-5">
      <h1 className="text-primary mb-4">
        {vista === 'pendientes'
          ? t('Pending Dispatches')
          : t('My Dispatches')}
      </h1>

      {/* BOTONES DE VISTA + FILTROS */}
      <div className="d-flex flex-column flex-md-row gap-3 mb-3 align-items-start align-items-md-center">
        <div className="btn-group">
          <Button
            variant={vista === 'pendientes' ? 'primary' : 'outline-primary'}
            onClick={() => handleCambiarVista('pendientes')}
          >
            {t('Pending Dispatches')}
          </Button>
          <Button
            variant={vista === 'mis_despachos' ? 'primary' : 'outline-primary'}
            onClick={() => handleCambiarVista('mis_despachos')}
          >
            {t('My Dispatches')}
          </Button>
        </div>

        <InputGroup style={{ maxWidth: '300px' }}>
          <InputGroup.Text>{t('Search')}</InputGroup.Text>
          <Form.Control
            placeholder="ID, cliente, boleta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Form.Select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          style={{ maxWidth: '180px' }}
        >
          <option value="todos">{t('filter.all')}</option>
          <option value="pendiente">{t('filter.pending')}</option>
          <option value="tomado">{t('filter.taken')}</option>
          <option value="en_camino">{t('filter.on_route')}</option>
          <option value="entregado">{t('filter.delivered')}</option>
        </Form.Select>
      </div>

      {/* RESULTADOS */}
      <div className="mb-2 text-muted">
        {processedDespachos.length === 1
          ? t('dispatch.foundOne', { count: processedDespachos.length })
          : t('dispatch.foundMany', { count: processedDespachos.length })}
      </div>

      {processedDespachos.length === 0 ? (
        <Alert variant="info">
          {t('No assigned dispatches')}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover>
            <thead className="table-light">
              <tr>
                <th
                  onClick={() => requestSort('id')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('ID')} {getSortIcon('id')}
                </th>
                <th
                  onClick={() => requestSort('cliente')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('Client')} {getSortIcon('cliente')}
                </th>
                <th
                  onClick={() => requestSort('boleta')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('Invoice')} {getSortIcon('boleta')}
                </th>
                <th
                  onClick={() => requestSort('estado')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('Status')} {getSortIcon('estado')}
                </th>
                <th>{t('Truck')}</th>
                <th>{t('Action')}</th>
              </tr>
            </thead>
            <tbody>
              {processedDespachos.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.cliente}</td>
                  <td>{d.boleta}</td>
                  <td>
                    <Badge
                      bg={
                        d.estado === 'pendiente'
                          ? 'secondary'
                          : d.estado === 'tomado'
                          ? 'warning'
                          : d.estado === 'en_camino'
                          ? 'info'
                          : d.estado === 'entregado'
                          ? 'success'
                          : 'dark'
                      }
                    >
                      {t(`status.${d.estado}`) || d.estado?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>{d.camion || '-'}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-1 flex-wrap">
                      {vista === 'pendientes' && d.estado === 'pendiente' && (
                        <Button
                          size="sm"
                          onClick={() => setSelected(d)}
                        >
                          {t('Take')}
                        </Button>
                      )}
                      {vista === 'mis_despachos' && d.estado === 'tomado' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => salirDespacho(d.id)}
                        >
                          {t('Exit')}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => setShowDetails(d)}
                      >
                        {t('View')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleVerMapa(d)}
                      >
                        {t('View Map')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* MODAL TOMAR */}
      <Modal
        show={!!selected && !showMap && !showDetails}
        onHide={() => {
          setSelected(null);
          setCamion('');
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {t('Take Dispatch')} #{selected?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t('Truck')}</Form.Label>
            <Form.Control
              value={camion}
              onChange={(e) => setCamion(e.target.value)}
              placeholder="Patente o identificación del camión"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setSelected(null);
              setCamion('');
            }}
          >
            {t('Close')}
          </Button>
          <Button variant="primary" onClick={tomarDespacho}>
            {t('Take')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DETALLES */}
      <Modal
        show={!!showDetails}
        onHide={() => setShowDetails(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Despacho #{showDetails?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDetails && (
            <>
              <p>
                <strong>{t('Address')}:</strong> {showDetails.direccion}
              </p>
              <p>
                <strong>{t('Client')}:</strong> {showDetails.cliente}
              </p>
              <p>
                <strong>{t('Phone')}:</strong> {showDetails.telefono}
              </p>
              <p>
                <strong>{t('Invoice')}:</strong> {showDetails.boleta}
              </p>
              <p>
                <strong>{t('Status')}:</strong>{' '}
                {t(`status.${showDetails.estado}`) || showDetails.estado}
              </p>
              <p>
                <strong>{t('Truck')}:</strong> {showDetails.camion || '-'}
              </p>
              <p>
                <strong>{t('Notes')}:</strong> {showDetails.notas}
              </p>
              {Array.isArray(showDetails.productos) &&
                showDetails.productos.length > 0 && (
                  <>
                    <hr />
                    <h5>{t('Products')}</h5>
                    <ul className="mb-0">
                      {showDetails.productos.map((p, idx) => (
                        <li key={idx}>
                          <strong>{t('Code')}:</strong> {p.codigo}{' '}
                          <strong>{t('Quantity')}:</strong> {p.cantidad}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetails(null)}
          >
            {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL MAPA */}
      <Modal show={showMap} onHide={handleCloseMap} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {t('View Map')} {selected ? `#${selected.id}` : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isGeocoding ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p>{t('Searching addresses in Chile')}</p>
            </div>
          ) : mapLocation ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapLocation}
              zoom={16}
            >
              <Marker position={mapLocation} />
            </GoogleMap>
          ) : geoError ? (
            <Alert variant="warning">{geoError}</Alert>
          ) : (
            <Alert variant="info">{t('No addresses found')}</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
