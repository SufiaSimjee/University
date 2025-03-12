import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useUpdateCategoryMutation, useGetCategoryByIdQuery } from '../../slices/categoriesApiSlice';

const EditCategory = () => {
    const { id: categoryId } = useParams(); 
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { data: category, isLoading, error ,refetch } = useGetCategoryByIdQuery(categoryId);
    const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
        }
    }, [category]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateCategory({ id: categoryId, data: { name, description } }).unwrap();
            toast.success("Category updated successfully");
            refetch();
            navigate('/categories');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FormContainer>
            <h1>Edit Category</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter category name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='description' className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Enter category description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Button type='submit' variant='primary' disabled={loadingUpdate}>
                        {loadingUpdate ? 'Updating...' : 'Update Category'}
                    </Button>
                </Form>
            )}
        </FormContainer>
        </div>
    );
};

export default EditCategory;
