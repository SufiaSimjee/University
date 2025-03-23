import { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { 
  useUpdateClosureDateMutation, 
  useGetLatestClosureDateQuery 
} from '../../slices/clouserDateApiSlice';

const AcademicYearUpdateScreen = () => {
  const { data: closureDate, isLoading, isError, error } = useGetLatestClosureDateQuery();
  const [updateClosureDate, { isLoading: updateLoading }] = useUpdateClosureDateMutation();

  const [academicYearStart, setAcademicYearStart] = useState('');
  const [academicYearEnd, setAcademicYearEnd] = useState('');
  const [ideaClosureDate, setIdeaClosureDate] = useState('');
  const [finalClosureDate, setFinalClosureDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { academicYearStart, academicYearEnd, ideaClosureDate, finalClosureDate };
      await updateClosureDate({ id: closureDate._id, data }).unwrap();
      toast.success('Closure date updated successfully.');
    } catch (err) {
      const message = err?.data?.message || err?.error || 'Error updating closure date';
      toast.error(message);
    }
  };

  useEffect(() => {
    if (closureDate) {
      const formatDate = (date) => {
        return date ? new Date(date).toISOString().split('T')[0] : '';
      };

      setAcademicYearStart(formatDate(closureDate.academicYearStart));
      setAcademicYearEnd(formatDate(closureDate.academicYearEnd));
      setIdeaClosureDate(formatDate(closureDate.ideaClosureDate));
      setFinalClosureDate(formatDate(closureDate.finalClosureDate));
    }
  }, [closureDate]);

  return (
    <div className='mt-5'>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error.message || 'Failed to load closure date.'}</Message>
      ) : (
        <FormContainer>
          <h1>Academic Year Settings</h1>
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

            <Button variant="info" type="submit" disabled={updateLoading} style={{ width: '100%' }}>
              {updateLoading ? 'Updating...' : 'Update Closure Date'}
            </Button>
          </Form>
        </FormContainer>
      )}
    </div>
  );
};

export default AcademicYearUpdateScreen;
