import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';
import { useGetAllDepartmentsQuery } from "../slices/departmentApiSlice"; 

const RegisterScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

   // Fetch departments 
  const { data: departments, isLoading: departmentsLoading, error } = useGetAllDepartmentsQuery();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await register({ fullName, email, password, departments: selectedDepartments }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Registration successful');
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <>
  
      <div className="text-center mb-4 mt-5">
        <h1>University Innovation & Improvement Hub</h1>
        <p>Empowering Staff Ideas for a Better Future</p>
      </div>

    <FormContainer>
      <h1>Create Your Account</h1>

      <Form onSubmit={submitHandler}>
        {/* Full Name Input */}
        <Form.Group controlId="fullName" className="my-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Group>

        {/* Email Input */}
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        {/* Password Input */}
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}

            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {/* Confirm Password Input */}
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>


        <Form.Group controlId="departments" className="my-3">
         <Form.Label>Departments</Form.Label>
          {departmentsLoading ? (
         <Loader />
        ) : error ? (
       <div>Error loading departments</div>
      ) : (
       <Form.Control
        as="select"
        multiple
        value={selectedDepartments}
        onChange={(e) => {
        const selectedValues = [...e.target.selectedOptions].map(o => o.value);
        setSelectedDepartments(selectedValues);
      }}
       >
      {departments?.map((department) => (
        <option key={department._id} value={department._id}>
          {department.name}
        </option>
      ))}
    </Form.Control>
  )}
   </Form.Group>


      <Col className="d-grid gap-2">
        <Button type="submit" variant="info" className="mt-2 roundded-0 text-white"
        disabled={isLoading}>
         Register
        </Button>
        </Col>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
    </>
  );
};

export default RegisterScreen;
