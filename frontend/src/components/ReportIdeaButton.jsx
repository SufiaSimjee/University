import {useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';
import { useCreateIdeaReportMutation } from '../slices/ideaReportApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ReportIdeaButton = ({ ideaId }) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const [createReport, { isLoading }] = useCreateIdeaReportMutation();

  const handleOpenModal = () => {
    if (!userInfo) {
      toast.error('Please login to report content');
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReason('');
    setMessage('');
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    try {
      await createReport({
        ideaId,  
        reason,
        ...(reason === 'Other' && { message })
      }).unwrap();
      
      toast.success('Report submitted successfully');
      handleCloseModal();
    } catch (err) {
      toast.error(
        err.data?.message || 
        err.error?.data?.message || 
        'Failed to submit report'
      );
    }
  };

  return (
    <>
      <Button 
        variant="danger" 
        size="md" 
        onClick={handleOpenModal}
        title="Report inappropriate content"
        className="ms-2 mb-3 text-white"
      >
        <FaFlag className="me-1" /> Report
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Report Idea</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitReport}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select reason</option>
                <option value="Swearing">Swearing/Profanity</option>
                <option value="Libel/Defamation">Libel/Defamation</option>
                <option value="Spam">Spam</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            {reason === 'Other' && (
              <Form.Group>
                <Form.Label>Details*</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Please provide details about your report"
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ReportIdeaButton;