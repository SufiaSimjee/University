import { useState } from 'react';
import { Button, Modal, Form, Tab, Nav, ListGroup, Badge } from 'react-bootstrap';
import { FaFlag, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { 
  useCreateIdeaReportMutation,
  useGetReportsByIdeaIdQuery 
} from '../slices/ideaReportApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import {FaInfoCircle} from 'react-icons/fa';

const AdminIdeaReportButton = ({ ideaId  }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  
  const [createReport, { isLoading }] = useCreateIdeaReportMutation();
  const { data: reports = [] } = useGetReportsByIdeaIdQuery(ideaId);

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

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Idea Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container activeKey={activeTab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="report" onClick={() => setActiveTab('report')}>
                  Report Idea
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="view" onClick={() => setActiveTab('view')}>
                  View Reports <Badge bg="secondary">{reports.length}</Badge>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="report">
                <Form onSubmit={handleSubmitReport}>
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
                      <Form.Label>Details</Form.Label>
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

                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                      Cancel
                    </Button>
                    <Button 
                      variant="danger" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Report'}
                    </Button>
                  </div>
                </Form>
              </Tab.Pane>

              <Tab.Pane eventKey="view">
                {reports.length === 0 ? (
                  <p className="text-center text-muted py-3">No reports yet</p>
                ) : (
                  <ListGroup variant="flush">
                    <Link to={`/user/${reports[0].ideaId.userId}`} className="text-decoration-none">
                      <Button variant="success" className="text-white">
                        <FaInfoCircle /> View Idea Owner Profile
                          </Button>
                       </Link>
                    {reports.map((report) => (
                      <ListGroup.Item key={report._id}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <FaUser className="me-2" />
                            <strong>{report.reportedBy.fullName}</strong>
                          </div>
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="mt-2">
                          <Badge bg="warning" className="me-2">
                            {report.reason}
                          </Badge>
                          {report.message && (
                            <p className="mt-2">{report.message}</p>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminIdeaReportButton;