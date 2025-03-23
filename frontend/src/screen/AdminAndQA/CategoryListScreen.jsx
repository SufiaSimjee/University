import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from "../../slices/categoriesApiSlice";
import { Button, Table } from 'react-bootstrap'; 
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import DownloadCategoryCSVButton from "../../components/DownloadCategoryCSVButton";
import { FaTrash, FaEdit } from 'react-icons/fa';
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const CategoryListScreen = () => {
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery(); 
  const [deleteCategory, { error: deleteError }] = useDeleteCategoryMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully.');
      } catch (err) {
        const message = err?.data?.message || err?.error || 'Error deleting category';
        toast.error(message);
      }
    }
  };

  return (
    <>
      <h1>Category List</h1>

      <Link to="/addCategory">
        <Button variant="info" className="mb-3">Add Category</Button>
      </Link>

      <DownloadCategoryCSVButton/>

      {isLoading ? <Loader /> : error ? (
        <Message variant="danger">Error loading categories!</Message>
      ) : categories?.length === 0 ? (
        <Message variant="info">There are no categories available.</Message>
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
            {categories?.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <Link to={`/editCategory/${category._id}`}>
                    <Button variant="warning" className="mr-2 m-2"> 
                      <FaEdit />
                    </Button>
                  </Link>

                  <Button variant="danger" onClick={() => deleteHandler(category._id)}>
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

export default CategoryListScreen;
