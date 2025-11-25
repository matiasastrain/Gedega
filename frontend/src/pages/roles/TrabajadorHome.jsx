// frontend/src/pages/roles/TrabajadorHome.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Button,
  Form,
  Table,
  Alert,
  Modal,
  Badge,
  InputGroup
} from 'react-bootstrap';
import { GoogleMap, Marker } from '@react-google-maps/api';
import API from '../../services/api';
import { useTranslation } from 'react-i18next';

const mapContainerStyle = { height: '250px', width: '100%' };

const initialFormState = {
  direccion: '',
  cliente: '',
  telefono: '',
  boleta: '',
  notas: '',
  productos: [{ codigo: '', cantidad: '' }],
  lat: '',
  lng: ''
};

export default function TrabajadorHome() {
  const { t } = useTranslation();

  const [despachos, setDespachos] = useState([]);
  const [loading, setLoading] = useState(false);

  // formulario
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  // filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'desc'
  });

  // detalles
  const [showDetails, setShowDetails] = useState(null);

  // mapa
  const [showMap, setShowMap] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [selectedDespacho, setSelectedDespacho] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [isValidationMode, setIsValidationMode] = useState(false);

  // Mapeo estados → clave traducción
  const statusLabelKey = {
    pendiente: 'status.pending',
    tomado: 'status.taken',
    en_camino: 'status.on_route',
    entregado: 'status.delivered',
    pending: 'status.pending',
    taken: 'status.taken',
    on_route: 'status.on_route',
    delivered: 'status.delivered'
  };

  // ================== CARGA DE DESPACHOS ==================
  const fetchDespachos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/despachos/my');
      setDespachos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert('Error al cargar despachos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDespachos();
  }, []);

  // ================== FORMULARIO ==================
  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setShowForm(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductoChange = (idx, field, value) => {
    setForm((prev) => {
      const productos = [...prev.productos];
      productos[idx] = { ...productos[idx], [field]: value };
      return { ...prev, productos };
    });
  };

  const addProducto = () => {
    setForm((prev) => ({
      ...prev,
      productos: [...prev.productos, { codigo: '', cantidad: '' }]
    }));
  };

  const removeProducto = (idx) => {
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form
    };

    try {
      if (editingId) {
        await API.put(`/despachos/${editingId}`, payload);
      } else {
        await API.post('/despachos', payload);
      }
      resetForm();
      fetchDespachos();
    } catch (err) {
      console.error(err);
      alert('Error al guardar el despacho.');
    }
  };

  const startEdit = (despacho) => {
    setEditingId(despacho.id);
    setForm({
      direccion: despacho.direccion || '',
      cliente: despacho.cliente || '',
      telefono: despacho.telefono || '',
      boleta: despacho.boleta || '',
      notas: despacho.notas || '',
      productos: despacho.productos || [{ codigo: '', cantidad: '' }],
      lat: despacho.lat || '',
      lng: despacho.lng || ''
    });
    setShowForm(true);
  };

  const deleteDespacho = async (id) => {
    if (!window.confirm('¿Eliminar este despacho?')) return;
    try {
      await API.delete(`/despachos/${id}`);
      fetchDespachos();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar despacho.');
    }
  };

  // ================== FILTROS / ORDEN ==================
  const processedDespachos = useMemo(() => {
    let res = [...despachos];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      res = res.filter(
        (d) =>
          d.id?.toString().includes(term) ||
          d.cliente?.toLowerCase().includes(term) ||
          d.boleta?.toLowerCase().includes(term)
      );
    }

    if (estadoFilter !== 'todos') {
      res = res.filter((d) => d.estado === estadoFilter);
    }

    res.sort((a, b) => {
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

    return res;
  }, [despachos, searchTerm, estadoFilter, sortConfig]);

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

  // ================== MAPA ==================
  const geocodeAddress = (address, callback) => {
    if (!window.google?.maps?.Geocoder) {
      setGeoError('Google Maps no está disponible.');
      setIsGeocoding(false);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: address + ', Chile' },
      (results, status) => {
        setIsGeocoding(false);
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          const coords = {
            lat: loc.lat(),
            lng: loc.lng()
          };
          callback(coords);
        } else {
          setGeoError('No se encontró la dirección.');
        }
      }
    );
  };

  const handleVerMapa = async (despacho) => {
    setIsValidationMode(false);
    setSelectedDespacho(despacho);
    setShowMap(true);
    setGeoError('');
    setMapLocation(null);
    setIsGeocoding(false);

    if (despacho.lat && despacho.lng) {
      setMapLocation({
        lat: parseFloat(despacho.lat),
        lng: parseFloat(despacho.lng)
      });
      return;
    }

    if (!despacho.direccion) {
      setGeoError('No hay dirección para mostrar.');
      return;
    }

    setIsGeocoding(true);
    geocodeAddress(despacho.direccion, (coords) => {
      setMapLocation(coords);
    });
  };

  const handleValidarDireccion = async () => {
    setIsValidationMode(true);
    setSelectedDespacho(null);
    setShowMap(true);
    setGeoError('');
    setMapLocation(null);

    if (!form.direccion) {
      setGeoError('Ingrese una dirección para validar.');
      return;
    }

    setIsGeocoding(true);
    geocodeAddress(form.direccion, (coords) => {
      setMapLocation(coords);
    });
  };

  const handleCloseMap = () => {
    setShowMap(false);
    setSelectedDespacho(null);
    setMapLocation(null);
    setGeoError('');
    setIsValidationMode(false);
  };

  // ================== RENDER ==================
  return (
    <div className="container py-5">
      <h1 className="text-info mb-4">{t('My Dispatches')}</h1>

      {/* BOTÓN NUEVO + FILTROS */}
      <div className="d-flex flex-column flex-md-row gap-3 mb-3">
        <Button
          onClick={() => {
            setForm(initialFormState);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          + {t('New Dispatch')}
        </Button>

        <InputGroup className="w-auto">
          <InputGroup.Text>{t('Search')}</InputGroup.Text>
          <Form.Control
            placeholder="ID, cliente o boleta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Form.Select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="todos">{t('filter.all')}</option>
          <option value="pendiente">{t('filter.pending')}</option>
          <option value="tomado">{t('filter.taken')}</option>
          <option value="en_camino">{t('filter.on_route')}</option>
          <option value="entregado">{t('filter.delivered')}</option>
        </Form.Select>
      </div>

      <div className="mb-2 text-muted">
        {processedDespachos.length === 1
          ? t('dispatch.foundOne', { count: processedDespachos.length })
          : t('dispatch.foundMany', { count: processedDespachos.length })}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info"></div>
        </div>
      ) : processedDespachos.length === 0 ? (
        <Alert variant="info">{t('No assigned dispatches')}</Alert>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table striped hover responsive>
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
                  <th>{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {processedDespachos.map((d) => {
                  const statusKey = statusLabelKey[d.estado] || null;

                  return (
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
                          {statusKey ? t(statusKey) : d.estado}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
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

                          <Button
                            size="sm"
                            onClick={() => startEdit(d)}
                          >
                            {t('Edit')}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteDespacho(d.id)}
                          >
                            {t('Delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* MODAL FORMULARIO */}
      <Modal show={showForm} onHide={resetForm} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? t('Edit Dispatch') : t('New Dispatch')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>{t('Address')}</Form.Label>
                  <Form.Control
                    value={form.direccion}
                    onChange={(e) =>
                      handleFormChange('direccion', e.target.value)
                    }
                    required
                  />
                </Form.Group>
                <Button
                  variant="outline-info"
                  onClick={handleValidarDireccion}
                  className="mt-2"
                >
                  {t('Validate on Map')}
                </Button>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>{t('Client')}</Form.Label>
                  <Form.Control
                    value={form.cliente}
                    onChange={(e) =>
                      handleFormChange('cliente', e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>{t('Phone')}</Form.Label>
                  <Form.Control
                    type="tel"
                    value={form.telefono}
                    onChange={(e) =>
                      handleFormChange('telefono', e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>{t('Invoice')}</Form.Label>
                  <Form.Control
                    value={form.boleta}
                    onChange={(e) =>
                      handleFormChange('boleta', e.target.value)
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label>{t('Notes')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.notas}
                    onChange={(e) =>
                      handleFormChange('notas', e.target.value)
                    }
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <h5>{t('Products')}</h5>
                {form.productos.map((p, idx) => (
                  <div
                    key={idx}
                    className="d-flex gap-2 align-items-center mb-2"
                  >
                    <Form.Control
                      placeholder={t('Code')}
                      value={p.codigo}
                      onChange={(e) =>
                        handleProductoChange(idx, 'codigo', e.target.value)
                      }
                    />
                    <Form.Control
                      placeholder={t('Quantity')}
                      type="number"
                      min="1"
                      value={p.cantidad}
                      onChange={(e) =>
                        handleProductoChange(idx, 'cantidad', e.target.value)
                      }
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeProducto(idx)}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addProducto}
                >
                  + {t('Add Product')}
                </Button>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={resetForm}>
                {t('Cancel')}
              </Button>
              <Button type="submit" variant="primary">
                {t('Save')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
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
                {statusLabelKey[showDetails.estado]
                  ? t(statusLabelKey[showDetails.estado])
                  : showDetails.estado}
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
            {isValidationMode ? t('Validate Address') : t('View Map')}
            {!isValidationMode && selectedDespacho
              ? ` #${selectedDespacho.id}`
              : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isGeocoding ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
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
            <Alert variant="info">
              {t('No addresses found')}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            {t('Close')}
          </Button>
          {isValidationMode && mapLocation && !geoError && !isGeocoding && (
            <Button
              variant="primary"
              onClick={() => {
                handleFormChange('lat', mapLocation.lat.toString());
                handleFormChange('lng', mapLocation.lng.toString());
                handleCloseMap();
              }}
            >
              {t('Confirm')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
