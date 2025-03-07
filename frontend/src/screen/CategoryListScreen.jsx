import React from 'react';
import { Table, Container } from 'react-bootstrap';
import { useGetAllCategoriesQuery } from '../slices/categoriesApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CategoryListScreen = () => {
  const { data: categories, isLoading, error } = useGetAllCategoriesQuery();

  return (
    <Container>
      <h1 className="my-4">Categories</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{"Categories error"}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category._id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CategoryListScreen;
