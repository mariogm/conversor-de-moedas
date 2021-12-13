import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Currencies from './Currencies';
import axios from 'axios';

function App() {

  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=eba7130a5b2d720ce43eb5fcddd47cc3';

  const [value, setValue] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('BRL');
  const [toCurrency, setToCurrency] = useState('USD');
  const [showSpinner, setShowSpinner] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  function handleValue(e) {
    setValue(e.target.value.replace(/\D/g, ''));
  }

  function handleFromCurrency(e) {
    setFromCurrency(e.target.value);
  }

  function handleToCurrency(e) {
    setToCurrency(e.target.value);
  }

  function closeModal(e) {
    setValue('1');
    setFromCurrency('BRL');
    setToCurrency('USD');
    setValidated(false)
    setShowModal(false);
  }

  function getConversion(rateData) {
    if(!rateData || rateData.success !== true) {
      return false;
    }

    const rateFrom = rateData.rates[fromCurrency];
    const rateTo = rateData.rates[toCurrency];
    const rate = (1 / rateFrom * rateTo) * value;
    return rate.toFixed(2);
  }

  function showError() {
    setShowAlert(true);
    setShowSpinner(false);
  }

  function convert(e) {
    e.preventDefault();
    setValidated(true);
    if(e.currentTarget.checkValidity() === true) {
      // request
      setShowSpinner(true);
      axios.get(FIXER_URL)
      .then(response => {
        const conversion = getConversion(response.data);
        if(conversion) {
          setResult(`A conversão de ${value} ${fromCurrency} é igual a ${conversion} ${toCurrency} `);
          setShowModal(true);
          setShowSpinner(false);
          setShowAlert(false);
        } else {
          showError();
        }
      })
      .catch(err => showError());
    }
  }



  return (
    <Container fluid className="d-flex justify-content-center align-items-center bg-success" style={{ height: '100%' }}>

      <Card style={{ width: '500px' }} className="m-1 bg-light rounded-3 shadow">
      <Form onSubmit={convert} noValidate validated={validated}>

        <Card.Header as="h3" className="p-4">Conversor de Moedas</Card.Header>
        
        <Card.Body className="p-4">
          <Alert variant="danger" show={showAlert}>Erro para carregar cotações. Tente novamente.</Alert>
            <Row className="mb-3">
              <Col sm="4">
                <Form.Control size="lg" placeholder="0" value={value} onChange={handleValue} required />
              </Col>
              <Col sm="8">
                <Form.Select size="lg" value={fromCurrency} onChange={handleFromCurrency}>
                  <Currencies />
                </Form.Select>
              </Col>
            </Row>

            <h4 className="text-center m-4"><span>calcular em</span> <FontAwesomeIcon className="text-success" icon={faSyncAlt}/></h4>

            <Form.Group>
              <Form.Select size="lg" value={toCurrency} onChange={handleToCurrency}>
                <Currencies />
              </Form.Select>
            </Form.Group>

        </Card.Body>

        <Card.Footer className="d-grid p-4">
          <Button variant="primary" type="submit" size="lg" data-testid="btn-convert">
            <span className={showSpinner ? 'hidden' : null }>Converter</span>
            <Spinner animation="border" size="md" className={showSpinner ? null : 'hidden'} />
          </Button>
        </Card.Footer>

      </Form>
      </Card>


      <Modal show={showModal} onHide={closeModal} data-testid="res-modal">
        <Modal.Header closeButton>
          <Modal.Title>Conversão</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3>{result}</h3>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
          <Button variant="primary" onClick={closeModal}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
