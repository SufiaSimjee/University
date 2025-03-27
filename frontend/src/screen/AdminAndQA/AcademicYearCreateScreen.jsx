import { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useCreateClouserDateMutation } from '../../slices/clouserDateApiSlice';
import { useNavigate } from 'react-router-dom';

const AcademicYearCreateScreen = () => {
  const [createClosureDate, { isLoading: createLoading, isError, error }] = useCreateClouserDateMutation();

  const [academicYearStart, setAcademicYearStart] = useState('');
  const [academicYearEnd, setAcademicYearEnd] = useState('');
  const [ideaClosureDate, setIdeaClosureDate] = useState('');
  const [finalClosureDate, setFinalClosureDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { academicYearStart, academicYearEnd, ideaClosureDate, finalClosureDate };
      await createClosureDate(data).unwrap();
      toast.success('New closure date created successfully.');
      setAcademicYearStart('');
      setAcademicYearEnd('');
      setIdeaClosureDate('');
      setFinalClosureDate('');
      navigate('/academicYear/history');
    } catch (err) {
      const message = err?.data?.message || err?.error || 'Error creating closure date';
      toast.error(message);
    }
  };

  return (
    <div className='mt-5'>
      <FormContainer>
        <h1>Create New Academic Year</h1>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="academicYearStart">
              <Form.Label>Academic Year Start</Form.Label>
              <Form.Control
                type="date"
                value={academicYearStart}
                onChange={(e) => setAcademicYearStart(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="academicYearEnd">
              <Form.Label>Academic Year End</Form.Label>
              <Form.Control
                type="date"
                value={academicYearEnd}
                onChange={(e) => setAcademicYearEnd(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="ideaClosureDate">
              <Form.Label>Idea Closure Date</Form.Label>
              <Form.Control
                type="date"
                value={ideaClosureDate}
                onChange={(e) => setIdeaClosureDate(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="finalClosureDate">
              <Form.Label>Final Closure Date</Form.Label>
              <Form.Control
                type="date"
                value={finalClosureDate}
                onChange={(e) => setFinalClosureDate(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Button variant="info" type="submit" disabled={createLoading} style={{ width: '100%' }}>
            {createLoading ? 'Creating...' : 'Create Closure Date'}
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default AcademicYearCreateScreen;
