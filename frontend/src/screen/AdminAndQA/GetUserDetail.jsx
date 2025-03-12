import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '../../slices/usersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Card, ListGroup, Row, Col, Badge, Button , Accordion } from 'react-bootstrap'; 

const GetUserDetail = () => {

  const { id } = useParams(); 
  const { data: user, error, isLoading } = useGetUserByIdQuery(id); 

  if (isLoading) return <Loader />;

  if (error) return <Message variant="danger">Error loading user details!</Message>;

  return (
    <div className="container mt-5">
      <h1>User Details</h1>
      
      {user ? (
        <Card>
          <Card.Header as="h5">
            {user.fullName}
        </Card.Header>

          <Card.Body>
            <Row>
        
              <Col md={6}>
                <h6>Email:</h6>
                <p>{user.email}</p>
              </Col>

              <Col md={6}>
                <h6>Status:</h6>
                <Badge pill bg={user.isActive ? 'success' : 'danger'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Col>

            </Row>

            <div className="mt-3">
              <h6>Role</h6>
              <p>{user.role ? user.role.name : 'No role assigned'}</p>
            </div>

            {/* <div className="mt-3">
              <h6>Departments</h6>
              {user.departments && user.departments.length > 0 ? (
                <ListGroup>
                  {user.departments.map((department) => (
                    <ListGroup.Item key={department._id}>{department.name}</ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No department assigned</p>
              )}
            </div> */}

          <Col md={6} >
            <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
            <Accordion.Header > View Department</Accordion.Header>
            <Accordion.Body>
              {user.departments && user.departments.length > 0 ? (
                user.departments.map((department) => (
                <p key={department._id} className="border-custom-item">
                {department.name}
              </p>
             ))
           ) : (
           <p>No department assigned</p>
           )}
         </Accordion.Body>
       </Accordion.Item>
       </Accordion>
      </Col>

            <Row className="mt-4">

              <Col>
                <Button variant="warning" className="w-100">
                  <FaEdit /> Edit
                </Button>
              </Col>

              <Col>
                <Button variant="danger" className="w-100">
                  <FaTrash /> Delete
                </Button>
              </Col>

            </Row>

          </Card.Body>
          
        </Card>
      ) : (
        <Message variant="info">User not found</Message>
      )}
    </div>
  );
};

export default GetUserDetail;
