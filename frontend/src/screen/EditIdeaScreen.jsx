import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import { useGetIdeaByIdQuery, useUpdateIdeaMutation } from '../slices/ideasApiSlice';
import { useGetAllCategoriesQuery } from '../slices/categoriesApiSlice';

const EditIdeaScreen = () => {
  const { id: ideaId } = useParams();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: idea, isLoading: ideaLoading, error: ideaError } = useGetIdeaByIdQuery(ideaId);
  const { data: categories, isLoading: categoriesLoading } = useGetAllCategoriesQuery();
  const [updateIdea, { isLoading: updating }] = useUpdateIdeaMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [fileUrls, setFileUrls] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  // Autofill on idea fetch
  useEffect(() => {
    if (idea) {
      setTitle(idea.title || '');
      setDescription(idea.description || '');
      setSelectedCategories(idea.category?.map((cat) => cat._id) || []);
      setIsAnonymous(idea.isAnonymous || false);
      setShowAllDepartments(idea.showAllDepartments || false);
      setAgreeToTerms(true);
      setExistingFiles(idea.fileUrls || []);
    }
  }, [idea]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isAnonymous', isAnonymous);
    formData.append('agreeToTerms', agreeToTerms);
    formData.append('showAllDepartments', showAllDepartments);

    selectedCategories.forEach((catId) => {
      formData.append('selectedCategories', catId);
    });

    fileUrls.forEach((file) => formData.append('files', file));

    try {
      await updateIdea({ideaId : ideaId, updatedData: formData }).unwrap();
      toast.success('Idea updated successfully');
      navigate('/myidea');
    } catch (error) {
      toast.error(error?.data?.message || 'Error updating idea');
    }
  };

  return (
    <FormContainer>
      <h2 className="text-center my-4">Edit Idea</h2>

      {(ideaLoading || categoriesLoading) ? (
        <p>Loading...</p>
      ) : ideaError ? (
        <p className="text-danger">Failed to load idea.</p>
      ) : (
        <Form onSubmit={submitHandler}>
          {/* Title */}
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

          {/* Description */}
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

          {/* Categories */}
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedCategories}
              onChange={(e) => {
                const selected = [...e.target.selectedOptions].map((o) => o.value);
                setSelectedCategories(selected);
              }}
            >
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <div className="mb-3">
              <Form.Label> Uploaded Files Name</Form.Label>
              <ul>
               {existingFiles.map((file, index) => (
                  <li key={index}>
                    {file.fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Update Files */}
          <Form.Group controlId="files">
            <Form.Label>Update Files</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setFileUrls([...e.target.files])}
            />
          </Form.Group>

          {/* Show to All Departments */}
          {(userInfo?.role?.name === 'Staff' || userInfo?.role?.name === 'QA Coordinator') && (
            <Form.Group controlId="showAllDepartments" className="my-3">
              <Form.Check
                type="checkbox"
                label="Show to all departments"
                checked={showAllDepartments}
                onChange={(e) => setShowAllDepartments(e.target.checked)}
              />
            </Form.Group>
          )}

          {/* Anonymous */}
          <Form.Group controlId="isAnonymous" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Submit as Anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
          </Form.Group>

          {/* Terms */}
          <Form.Group controlId="agreeToTerms">
            <Form.Check
              type="checkbox"
              label={
                <>
                  I agree to the{' '}
                  <Link to="/termsAndConditions">terms and conditions</Link>
                </>
              }
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mt-3" variant="info" disabled={updating}>
            {updating ? 'Updating...' : 'Update Idea'}
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default EditIdeaScreen;
