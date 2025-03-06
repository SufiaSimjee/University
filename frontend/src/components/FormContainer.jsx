import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container >
      <Row className="justify-content-md-center">
        <Col xs={12} md={6} className="bg-white rounded-3 p-4">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
