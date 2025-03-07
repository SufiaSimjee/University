import { useGetAllCategoriesQuery } from "../slices/categoriesApiSlice";
import { Button, Table } from 'react-bootstrap'; 
import Message from "../components/Message";
import Loader from "../components/Loader";

const CategoryListScreen = () => {
  const { data: categories, error, isLoading } = useGetAllCategoriesQuery(); 

  if (isLoading) return <Loader/>;
  if (error) return <Message variant="danger">Error loading categories!</Message>;

  if (categories && categories.length === 0) {
    return <Message variant="info">There are no categories available.</Message>;
  }

  return (
    <>
      <h1>Category List</h1>
     
      <Button variant="primary" className="mb-3">Add Category</Button>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Departments</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
               
                {category.departments?.map((department) => (
                  <span key={department._id}>{department.name}</span>
                ))}
              </td>
              <td>
                <Button variant="warning" className="mr-2">Edit</Button>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CategoryListScreen;
