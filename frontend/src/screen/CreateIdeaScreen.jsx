import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { useCreateIdeaMutation } from '../slices/ideasApiSlice';
import { useGetAllCategoriesQuery } from '../slices/categoriesApiSlice';
import {  useNavigate} from "react-router-dom";

const CreateIdeaScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [files, setFiles] = useState([]);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
  const [createIdea, { isLoading: ideaUploadLoading }] = useCreateIdeaMutation();
  const  navigate = useNavigate();

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isAnonymous', isAnonymous);
    formData.append('agreeToTerms', agreeToTerms);
    formData.append('showAllDepartments', showAllDepartments);

    // Append each category individually
   selectedCategories.forEach((category) => {
    formData.append('selectedCategories', category);
  });

    // Append files to the form data
    files.forEach((file) => formData.append('files', file));

    try {
      await createIdea(formData).unwrap();
      navigate('/ideas');
      toast.success('Idea submitted successfully');
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'Error submitting idea');
    }
  };

  return (
    <FormContainer>
      <h2 className="text-center my-4">Submit Your Idea</h2>
      <Form onSubmit={submitHandler}>
        {/* Title input */}
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter idea title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Description input */}
        <Form.Group controlId="description">
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

        {/* Category selection */}
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={selectedCategories}
            onChange={(e) => {
              const selectedValues = [...e.target.selectedOptions].map((o) => o.value);
              setSelectedCategories(selectedValues);  // Keep track of multiple selections
            }}
          >
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* File upload */}
        <Form.Group controlId="files">
          <Form.Label>Upload Files</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />
        </Form.Group>

        {/* Show to all departments checkbox */}
        <Form.Group controlId="showAllDepartments" className="my-3">
          <Form.Check
            type="checkbox"
            label="Show to all departments"
            checked={showAllDepartments}
            onChange={(e) => setShowAllDepartments(e.target.checked)}
          />
        </Form.Group>

        {/* Anonymous submission checkbox */}
        <Form.Group controlId="isAnonymous" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Submit as Anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
        </Form.Group>

        {/* Terms and conditions checkbox */}
        <Form.Group controlId="agreeToTerms">
          <Form.Check
            type="checkbox"
            label="I agree to the terms and conditions"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            required
          />
        </Form.Group>

        <Button variant="info" type="submit" className="w-100" disabled={ideaUploadLoading}>
          {ideaUploadLoading ? 'Submitting...' : 'Submit Idea'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateIdeaScreen;
