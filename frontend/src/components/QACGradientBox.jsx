import { Card, Spinner, Container, Row, Col } from "react-bootstrap";
import { useGetdepartmentusercountQuery } from "../slices/reportSlice";  

const StatCard = ({ title, value, isLoading, error, gradientColors }) => {
  return (
    <Card
      className="text-center shadow-sm"
      style={{
        background: `linear-gradient(45deg, ${gradientColors[0]}, ${gradientColors[1]})`,
        color: "#fff",
        padding: "20px",
        borderRadius: "10px",
        transition: "transform 0.2s ease-in-out",
        cursor: "pointer",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Card.Body>
        <Card.Title style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
          {title}
        </Card.Title>
        <div style={{ fontSize: "2.3rem", fontWeight: "bold" }}>
          {isLoading ? (
            <Spinner animation="border" style={{ width: "2rem", height: "2rem" }} />
          ) : error ? (
            "Error"
          ) : (
            value
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const QACGradientBox = () => {
  const { data: userDepartmentCountData, isLoading: ideasLoading, error: ideasError } = useGetdepartmentusercountQuery();

  if (ideasError) {
    return (
      <Container className="my-4">
        <div className="text-center text-danger">
          Error loading data. Please try again later.
        </div>
      </Container>
    );
  }

  if (ideasLoading) {
    return (
      <Container className="my-4">
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="g-4">
        <Col md={6} lg={4}>
          <StatCard
            title="Total User In Your Department"
            value={userDepartmentCountData?.totalUsers || 0} 
            isLoading={ideasLoading}
            error={ideasError}
            gradientColors={["#007bff", "#6610f2"]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default QACGradientBox;