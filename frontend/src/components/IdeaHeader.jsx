import { Badge } from "react-bootstrap";
import {Card } from "react-bootstrap";

const IdeaHeader = ({ title, description, category, showAllDepartments, departments }) => {
  return (
    <>
      <Card.Title className="mb-3">{title}</Card.Title>
      <Card.Text className="text-muted">{description}</Card.Text>

      {/*  category  */}
      <div className="mb-3">
      <strong>Category: </strong>
        {category.map((cat) => (
         <Badge key={cat._id} bg="primary" className="me-2">
         {cat.name}
       </Badge>
        ))}
      </div>

      {/*  department  */}
      <div className="mb-3">
      <strong>Department: </strong>
        {showAllDepartments ? (
          <Badge bg="success"> All Departments</Badge>
        ) : (
          <div>

            {departments.map((dept) => (
              <Badge key={dept._id} bg="warning" className="me-1">
                {dept.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default IdeaHeader;