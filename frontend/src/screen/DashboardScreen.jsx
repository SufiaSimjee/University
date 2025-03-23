import { Container, Row, Col, Card } from "react-bootstrap";
import GetNumberOfIdeaByDepartment from "../components/GetNumberOfIdeaByDepartment";
import GetNumberOfIdeaByPercentage from "../components/GetNumberOfIdeaByPercentage";
import GetNumberOfContributorsByDepartment from "../components/GetContributorsByDepartment";
import GetAnonymousIdeasAndComments from "../components/GetAnonymousIdeasAndComments";
import GetIdeasWithAndWithoutComments from "../components/GetIdeasWithCommentAndWithout";
import GradientBox from "../components/GradientBox";

const DashboardScreen = () => {
  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col>
          <GradientBox />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <GetNumberOfIdeaByDepartment />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <GetNumberOfIdeaByPercentage />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <GetNumberOfContributorsByDepartment />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <GetAnonymousIdeasAndComments />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <GetIdeasWithAndWithoutComments />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;