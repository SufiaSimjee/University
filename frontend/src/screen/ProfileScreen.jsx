import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import { Button, Form , Col} from 'react-bootstrap';
import FormContainer from "../components/FormContainer";

const ProfileScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [profile, { isLoading: loadingUpdateProfile, error: updateProfileError }] = useUpdateUserMutation();

    useEffect(() => {
        if (userInfo) {
            setFullName(userInfo.fullName);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await profile({
                    fullName,
                    email,
                    password,
                }).unwrap();
                
                dispatch(setCredentials({
                    ...userInfo,  
                    fullName: res.fullName,  
                    email: res.email,        
                    password: res.password,  
                }));
                toast.success('Profile updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <FormContainer>
                <h1>Profile</h1>

                {updateProfileError && <Message variant='danger'>{updateProfileError?.data?.message || updateProfileError.error}</Message>}

                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-2' controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter name'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className='my-2' controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className='my-2' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className='my-2' controlId='confirmPassword'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Col className="d-grid gap-2">
                    <Button type='submit' variant='info' disabled={loadingUpdateProfile}>
                        Update
                    </Button>
                    </Col>
                    {loadingUpdateProfile && <Loader />}
                </Form>
            </FormContainer>
        </>
    );
}

export default ProfileScreen;
