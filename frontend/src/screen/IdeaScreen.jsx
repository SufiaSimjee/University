import { useState, useEffect } from 'react';
import { useGetAllIdeasQuery } from '../slices/ideasApiSlice';
import { useGetAllCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetAllDepartmentsQuery } from '../slices/departmentApiSlice'; 
import { Card, Button, Badge, Form, Row, Col, Pagination } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import DownloadButton from '../components/DownloadButton';

const IdeaScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;

  const { data: ideas, error, isLoading } = useGetAllIdeasQuery();
  const { data: categories } = useGetAllCategoriesQuery();

  const { data: allDepartments } = useGetAllDepartmentsQuery({
    skip: !(userInfo?.role?.name === 'Admin' || userInfo?.role?.name === 'QA Manager')
  });

  const departments = ideas
    ? [...new Set(ideas.flatMap((idea) => idea.userId?.departments?.map((dept) => dept.name)))].concat(
        allDepartments ? allDepartments : []
      )
    : [];

  const filteredIdeas = ideas?.filter((idea) => {
    const searchLower = searchText.toLowerCase();
    const matchesText =
      idea.title.toLowerCase().includes(searchLower) ||
      idea.description.toLowerCase().includes(searchLower);
    const matchesCategory = selectedCategory
      ? idea.category.some((cat) => cat.name === selectedCategory)
      : true;
    const matchesDepartment =
      selectedDepartment === 'All Departments'
        ? true
        : selectedDepartment
        ? idea.userId?.departments.some((dept) => dept.name === selectedDepartment) &&
          !idea.showAllDepartments
        : true;

    return matchesText && matchesCategory && matchesDepartment;
  }) || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory, selectedDepartment]);

  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = filteredIdeas.slice(indexOfFirstIdea, indexOfLastIdea);
  const totalPages = Math.ceil(filteredIdeas.length / ideasPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <Message>Error fetching ideas. Please try again later.</Message>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">All Ideas</h1>

      {/* New Idea Button */}
      <div className="d-flex justify-content-start mb-4">
        <Link to="/ideas/create">
          <Button variant="success" className="shadow-sm text-white">
            Add New Idea
          </Button>
        </Link>
      </div>

      {/* Search & Filter Section */}
      <Form>
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by title or description"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="shadow-sm"
            />
          </Col>

          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="shadow-sm"
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="shadow-sm"
            >
              <option value="All Departments">All Departments</option>
              {userInfo?.role?.name === 'Admin' || userInfo?.role?.name === 'QA Manager'
                ? allDepartments?.map((department) => (
                    <option key={department._id} value={department.name}>
                      {department.name}
                    </option>
                  ))
                : userInfo?.departments?.map((department, idx) => (
                    <option key={idx} value={department.name}>
                      {department.name}
                    </option>
                  ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Ideas */}
      {currentIdeas.length > 0 ? (
        currentIdeas.map((idea) => (
          <Card key={idea._id} className="mb-3 shadow-sm">
            <Card.Body>
              {/* Uploader Name and Timestamp at the Top */}
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
        <div className="text-center text-muted">No ideas available</div>
      )}

      {/* Pagination Controls */}
      {filteredIdeas.length > ideasPerPage && (
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

export default IdeaScreen;
