import { useGetAllDepartmentsQuery, useDeleteDepartmentMutation } from "../../slices/departmentApiSlice";
import { Button, Table } from 'react-bootstrap'; 
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'; 
import { FaTrash, FaEdit } from 'react-icons/fa';
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const DepartmentListScreen = () => {
  const { data: departments, error, isLoading } = useGetAllDepartmentsQuery(); 
  const [deleteDepartment, { error: deleteError }] = useDeleteDepartmentMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment(id).unwrap();
        toast.success('Department deleted successfully.');
      } catch (err) {
        const message = err?.data?.message || err?.error || 'Error deleting department';
        toast.error(message);
      }
    }
  };

  return (
    <>
      <h1>Department List</h1>
      
      <Link to='/addDepartment'>
        <Button variant="info" className="mb-3">Add Department</Button>
      </Link>

      {isLoading ? <Loader /> : error ? (
        <Message variant="danger">Error loading departments!</Message>
      ) : departments?.length === 0 ? (
        <Message variant="info">There are no departments available.</Message>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments?.map((department) => (
              <tr key={department._id}>
                <td>{department._id}</td>
                <td>{department.name}</td>
                <td>{department.description}</td>
                <td>
                  <Link to={`/editDepartment/${department._id}`}>
                    <Button variant="warning" className="mr-2 m-2">
                      <FaEdit />
                    </Button>
                  </Link>

                  <Button variant="danger" onClick={() => deleteHandler(department._id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default DepartmentListScreen;
