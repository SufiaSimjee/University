import { useGetAllUsersForQacQuery } from "../../slices/usersApiSlice";
import { Button, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FaInfoCircle } from 'react-icons/fa';
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const GetAllUserQACScreen = () => {
  const { data: users, error, isLoading } = useGetAllUsersForQacQuery();

  return (
    <>
      <h1>QA Coordinator Department Users</h1>

      {/* Link to add a user */}
      <Link to="/QAC/register">
        <Button variant="info" className="mb-3">Add User</Button>
      </Link>

      {/* Show loading state */}
      {isLoading ? <Loader /> : error ? (
        <Message variant="danger">Error loading users!</Message>
      ) : users?.length === 0 ? (
        <Message variant="info">There are no users in the same department as you.</Message>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <Link to={`/user/${user._id}`}>
                    <Button variant="success" className="text-white">
                      <FaInfoCircle />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default GetAllUserQACScreen;
