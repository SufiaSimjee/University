/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  DropdownButton,
  Dropdown,
  FormCheck,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateIdeaMutation } from '../slices/ideasApiSlice';
import { useGetAllCategoriesQuery } from '../slices/categoriesApiSlice';

const IdeaScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [upVotes, setUpVotes] = useState([]);
  const [downVotes, setDownVotes] = useState([]);

  // Fetch categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();
  const [createIdea, { isLoading: ideaUploadLoading }] =
    useCreateIdeaMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createIdea({
        title,
        description,
        selectedCategories,
        isAnonymous,
        agreeToTerms,
        upVotes,
        downVotes,
      }).unwrap();
      toast.success('Idea submitted successfully');
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h2 className="text-center my-4">Submit Your Idea</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter idea title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your idea..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              {categoriesLoading ? (
                <Loader />
              ) : categoriesError ? (
                <Message variant="danger">{categoriesError.message}</Message>
              ) : (
                <Form.Control
                  as="select"
                  multiple
                  value={selectedCategories}
                  onChange={(e) => {
                    const selectedValues = [...e.target.selectedOptions].map(
                      (o) => o.value
                    );
                    setSelectedCategories(selectedValues);
                  }}
                >
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>

            <Form.Group controlId="isAnonymous" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Submit as Anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            </Form.Group>

            <Form.Group controlId="agreeToTerms" className="mb-3">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and conditions"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={ideaUploadLoading}
            >
              {ideaUploadLoading ? 'Submitting...' : 'Submit Idea'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default IdeaScreen;
