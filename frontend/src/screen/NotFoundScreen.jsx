import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import NotFoundAnimation from "./notfound.json"; 


const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center d-flex flex-column align-items-center justify-content-center vh-100">
      <Lottie animationData={NotFoundAnimation} style={{ width: 300, height: 300 }} />
      <h1 className="display-4 text-danger">404</h1>
      <h2 className="mb-3">Oops! Page Not Found</h2>
      <p className="text-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Container>
  );
};

export default NotFound;
