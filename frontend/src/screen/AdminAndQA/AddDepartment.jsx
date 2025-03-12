import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { useCreateDepartmentMutation } from "../../slices/departmentApiSlice";
import { toast } from 'react-toastify';

const AddDepartment = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const [department, { isLoading }] = useCreateDepartmentMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await department({ name, description }).unwrap();
      toast.success("Department created successfully");
      navigate('/departments');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <FormContainer>
        <h1>Add New Department</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="my-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea" 
              rows={3} 
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Col className="d-grid gap-2">
            <Button
              type="submit"
              variant="info"
              className="mt-2 text-white rounded-25"
              disabled={isLoading}
            >
              Add
            </Button>
          </Col>

          {isLoading && <Loader />}
        </Form>
      </FormContainer>
    </div>
  );
};

export default AddDepartment;
