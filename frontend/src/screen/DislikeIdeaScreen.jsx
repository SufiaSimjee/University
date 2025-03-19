import { useGetMostDislikedIdeasQuery } from '../slices/ideasApiSlice';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';

const DislikeIdeaScreen = () => {
  const { data: dislikeIdeas, error, isLoading } = useGetMostDislikedIdeasQuery();


  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <Message>Error fetching popular ideas. Please try again later.</Message>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Most Popular Ideas</h1>

      {/* New Idea Button */}
      <div className="d-flex justify-content-start mb-4">
        <Link to="/ideas/create">
          <Button variant="success" className="shadow-sm text-white">
            Add New Idea
          </Button>
        </Link>
      </div>

      {/* Popular Ideas */}
      {dislikeIdeas?.length > 0 ? (
        dislikeIdeas.map((idea) => (
          <Card key={idea._id} className="mb-3 shadow-sm">
            <Card.Body>
              {/* Uploader Name and Timestamp */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Uploaded by : {idea.isAnonymous ? 'Anonymous' : idea.userId?.fullName}</strong>
                </div>
                <small className="text-muted">
                  {new Date(idea.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>

              {/* Idea Title and Description */}
              <Card.Title className="mb-3">{idea.title}</Card.Title>
              <Card.Text className="text-muted mb-3">{idea.description}</Card.Text>

              {/* Categories */}
              <Card.Text>
                <strong>Categories: </strong>
                {idea.category.map((cat) => (
                  <Badge key={cat._id} bg="primary" className="me-2">
                    {cat.name}
                  </Badge>
                ))}
              </Card.Text>

              {/* Departments */}
              {idea.showAllDepartments ? (
                <Card.Text>
                  <strong>Department: </strong>
                  <Badge bg="success" className="ms-2">
                    All Departments
                  </Badge>
                </Card.Text>
              ) : (
                idea.userId &&
                idea.userId.departments && (
                  <Card.Text>
                    <strong>Departments: </strong>
                    {idea.userId.departments.map((dept) => (
                      <Badge key={dept._id} bg="warning" className="me-2">
                        {dept.name}
                      </Badge>
                    ))}
                  </Card.Text>
                )
              )}

              {/* View Details Button */}
              <Link to={`/ideas/${idea._id}`}>
                <Button variant="info" className="mt-3 text-white">
                  View Details
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center text-muted">No popular ideas available</div>
      )}
    </div>
  );
};

export default DislikeIdeaScreen;
