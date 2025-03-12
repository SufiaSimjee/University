import { useGetAllUsersForQaQuery } from "../../slices/usersApiSlice";
import { Button, Table } from 'react-bootstrap'; 
import { Link } from "react-router-dom";
import { FaInfoCircle } from 'react-icons/fa';
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const GetAllUserForQAScreen = () => {
  const { data: users, error, isLoading } = useGetAllUsersForQaQuery(); 

  return (
    <>
      <h1>User List</h1>

    
      <Link to="/QA/register">
        <Button variant="info" className="mb-3">Add User</Button>
      </Link>

      {isLoading ? <Loader /> : error ? (
        <Message variant="danger">Error loading users!</Message>
      ) : users?.length === 0 ? (
        <Message variant="info">There are no users available.</Message>
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

export default GetAllUserForQAScreen;
