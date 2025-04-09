import { useState } from 'react';
import { useGetMyIdeasQuery, useDeleteIdeaMutation } from '../slices/ideasApiSlice';
import { Card, Button, Badge, Pagination } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';

const MyIdeaScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;

  const { data: ideas, error, isLoading } = useGetMyIdeasQuery();
  const [deleteIdea] = useDeleteIdeaMutation();

  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;

  const currentIdeas = ideas ? ideas.slice(indexOfFirstIdea, indexOfLastIdea) : [];
  const totalPages = ideas ? Math.ceil(ideas.length / ideasPerPage) : 0;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(id).unwrap();
        alert('Idea deleted successfully');
      } catch (err) {
        alert('Error deleting idea. Please try again.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <Message variant="danger">Error fetching ideas. Please try again later.</Message>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Ideas</h1>

      {/* New Idea Button */}
      <div className="d-flex justify-content-start mb-4">
        <Link to="/ideas/create">
          <Button variant="success" className="shadow-sm text-white">
            Add New Idea
          </Button>
        </Link>
      </div>

      {currentIdeas.length > 0 ? (
        currentIdeas.map((idea) => (
          <Card key={idea._id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Uploaded by: {idea.isAnonymous ? 'Anonymous' : idea.userId?.fullName}</strong>
                </div>
                <div>
                  <Link to={`/editidea/${idea._id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                      <FaEdit />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(idea._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>

              <div className="text-muted mb-3">
                <strong>Created at:</strong> 
                {new Date(idea.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </div>

              {/* Title & Description */}
              <Card.Title className="mb-3">{idea.title}</Card.Title>
              <Card.Text className="text-muted mb-3">{idea.description}</Card.Text>

              {/* Category */}
             {idea.category && idea.category.length > 0 && (
               <Card.Text>
                <strong>Categories: </strong>
                 {idea.category.map((cat) => (
                   <Badge key={cat._id} bg="primary" className="me-2">
                    {cat.name}
                  </Badge>
                ))}
              </Card.Text>
             )}

              {/* Departments */}
              {idea.showAllDepartments ? (
                <Card.Text>
                  <strong>Department: </strong>
                  <Badge bg="success" className="ms-2">All Departments</Badge>
                </Card.Text>
              ) : (
                idea.userId?.departments?.length > 0 && (
                  <Card.Text>
                    <strong>Departments: </strong>
                    {idea.userId.departments.map((dept) => (
                      <Badge key={dept._id} bg="warning" className="me-2">{dept.name}</Badge>
                    ))}
                  </Card.Text>
                )
              )}

              {/* View Button */}
              <Link to={`/ideas/${idea._id}`}>
                <Button variant="info" className="mt-3 text-white">View Details</Button>
              </Link>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center text-muted">You have not uploaded any ideas yet.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
              className="shadow-sm"
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export default MyIdeaScreen;
