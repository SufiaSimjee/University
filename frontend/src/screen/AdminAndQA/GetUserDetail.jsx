import { useParams, useNavigate } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserForManagerMutation , useDeleteUserMutation} from '../../slices/usersApiSlice'; 
import { useGetAllDepartmentsQuery } from '../../slices/departmentApiSlice';
import { useGetAllRolesQuery } from '../../slices/roleApiSlice';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';
import Message from '../../components/Message';
import { FaTrash } from 'react-icons/fa';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

const GetUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, error, isLoading: userLoading  , refetch} = useGetUserByIdQuery(id);
  const { data: departments, isLoading: departmentsLoading } = useGetAllDepartmentsQuery();
  const { data: roles, isLoading: rolesLoading } = useGetAllRolesQuery();

  const [updateUserForManager, { isLoading: updatingUser }] = useUpdateUserForManagerMutation();
  const [deleteUser, { isLoading: isDeleting  }] = useDeleteUserMutation(); 

  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    role: '',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        department: user.departments[0]?._id || '',
        role: user.role?._id || '',
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully.');
        refetch();
        if (userInfo.role.name === 'Admin') {
          navigate('/admin/users');
        } else if (userInfo.role.name === 'QA Manager') {
          navigate('/qa/users');
        } else if (userInfo.role.name === 'QA Coordinator') {
          navigate('/QAC/users');
        }
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToUpdate = {
      id: id, 
      fullName: formData.fullName,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      isActive: formData.isActive,
    };

    try {
      await updateUserForManager(dataToUpdate).unwrap();
      refetch();
      toast.success('User updated successfully.');
      if (userInfo.role.name === 'Admin') {
        
        navigate('/admin/users');
      } else if (userInfo.role.name === 'QA Manager') {
        navigate('/qa/users');
      } else if (userInfo.role.name === 'QA Coordinator') {
        navigate('/QAC/users');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (userLoading || departmentsLoading || rolesLoading) return <Loader />;

  if (error) return <Message variant="danger">Error loading user details!</Message>;

  const filteredRoles = roles?.filter(role => {
    if (userInfo.role.name === 'QA Manager') {
      return role.name !== 'Admin';
    } else if (userInfo.role.name === 'QA Coordinator') {
      return role.name !== 'Admin' && role.name !== 'QA Manager';
    }
    return true; 
  });

  const filteredDepartments = departments?.filter(department => {
    if (userInfo.role.name === 'QA Coordinator') {
      return department._id === userInfo.departments[0]?._id; 
    }
    return true; 
  });

  return (
    <div className="container mt-5">
      <h1>Edit User</h1>

      {user ? (
        <Card>
          <Card.Header as="h5">Edit {user.fullName}</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="department">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Select Department</option>
                      {filteredDepartments?.map((department) => (
                        <option key={department._id} value={department._id}>
                          {department.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="">Select Role</option>
                      {filteredRoles?.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="isActive">
                    <Form.Label>Active</Form.Label>
                    <Form.Control
                      as="select"
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.value === 'true' })
                      }
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col>
                  <Button variant="warning" className="w-100" type="submit" disabled={updatingUser}>
                    {updatingUser ? 'Updating...' : 'Update'}
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={handleDelete}
                    disabled={isDeleting || updatingUser}
                  >
                    <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Message variant="info">User not found</Message>
      )}
    </div>
  );
};

export default GetUserDetail;
