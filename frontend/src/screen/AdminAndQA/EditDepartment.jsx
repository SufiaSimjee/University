import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { useUpdateDepartmentMutation, useGetDepartmentByIdQuery } from '../../slices/departmentApiSlice';

const EditDepartment = () => {
    const { id: departmentId } = useParams(); 
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { data: department, isLoading, error ,refetch } = useGetDepartmentByIdQuery(departmentId);
    const [updateDepartment, { isLoading: loadingUpdate }] = useUpdateDepartmentMutation();

    useEffect(() => {
        if (department) {
            setName(department.name);
            setDescription(department.description);
        }
    }, [department]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateDepartment({ id: departmentId, data: { name, description } }).unwrap();
            toast.success("Department updated successfully");
            refetch();
            navigate('/departments');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FormContainer>
            <h1>Edit Department</h1>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter department name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='description' className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Enter department description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Button type='submit' variant='primary' disabled={loadingUpdate}>
                        {loadingUpdate ? 'Updating...' : 'Update Department'}
                    </Button>
                </Form>
            )}
        </FormContainer>
        </div>
    );
};

export default EditDepartment;
