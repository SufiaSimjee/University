import { Card, Spinner, Container, Row, Col } from "react-bootstrap";
import {
  useGetCategoryCountQuery,
  useGetDepartmentCountQuery,
  useGetNonAnonymousIdeasCountQuery,
  useGetAnonymousIdeasCountQuery,
} from "../slices/reportSlice";

const StatCard = ({ title, value, isLoading, gradientColors }) => {
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
          {isLoading ? <Spinner animation="border" style={{ width: "2rem", height: "2rem" }} /> : value}
        </div>
      </Card.Body>
    </Card>
  );
};

const GradientBox = () => {
  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useGetCategoryCountQuery();
  const { data: departmentData, isLoading: departmentLoading, error: departmentError } = useGetDepartmentCountQuery();
  const { data: nonAnonymousData, isLoading: nonAnonymousLoading, error: nonAnonymousError } = useGetNonAnonymousIdeasCountQuery();
  const { data: anonymousData, isLoading: anonymousLoading, error: anonymousError } = useGetAnonymousIdeasCountQuery();


  if (categoryError || departmentError || nonAnonymousError || anonymousError) {
    return (
      <Container className="my-4">
        <div className="text-center text-danger">
          Error loading data. Please try again later.
        </div>
      </Container>
    );
  }

  // Handle loading state
  if (categoryLoading || departmentLoading || nonAnonymousLoading || anonymousLoading) {
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
        {/* Category Count */}
        <Col md={6} lg={4}>
          <StatCard
            title="Total Categories"
            value={categoryData?.totalCategories}
            isLoading={categoryLoading}
            gradientColors={["#007bff", "#6610f2"]}
          />
        </Col>

        {/* Department Count */}
        <Col md={6} lg={4}>
          <StatCard
            title="Total Departments"
            value={departmentData?.totalDepartments}
            isLoading={departmentLoading}
            gradientColors={["#28A745", "#218838"]}
          />
        </Col>

        {/* Non-Anonymous Ideas Count */}
        <Col md={6} lg={4}>
          <StatCard
            title="Non-Anonymous Ideas"
            value={nonAnonymousData?.nonAnonymousIdeasCount} 
            isLoading={nonAnonymousLoading}
            gradientColors={["#FF5733", "#C70039"]}
          />
        </Col>

        {/* Anonymous Ideas Count */}
        <Col md={6} lg={4}>
          <StatCard
            title="Anonymous Ideas"
            value={anonymousData?.anonymousIdeasCount} 
            isLoading={anonymousLoading}
            gradientColors={["#17A2B8", "#138496"]}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default GradientBox;