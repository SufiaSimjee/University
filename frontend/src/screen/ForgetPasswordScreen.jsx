import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useForgotPasswordMutation, useResetPasswordMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword( email ).unwrap();
      setIsCodeSent(true);
      toast.success("Reset code sent to your email");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ email, resetCode, newPassword }).unwrap();
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <h1>{isCodeSent ? "Reset Your Password" : "Forgot Password"}</h1>

      {!isCodeSent ? (
        <Form onSubmit={handleForgotPassword}>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Col className="d-grid gap-2">
            <Button type="submit" variant="info" className="mt-2 text-white rounded-25" disabled={isForgotPasswordLoading}>
              Send Reset Code
            </Button>
          </Col>

          {isForgotPasswordLoading && <Loader />}
        </Form>
      ) : (
        <Form onSubmit={handleResetPassword}>
          <Form.Group controlId="resetCode" className="my-3">
            <Form.Label>Reset Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter reset code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="newPassword" className="my-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Col className="d-grid gap-2">
            <Button type="submit" variant="info" className="mt-2 text-white rounded-25" disabled={isResetPasswordLoading}>
              Reset Password
            </Button>
          </Col>

          {isResetPasswordLoading && <Loader />}
        </Form>
      )}
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
