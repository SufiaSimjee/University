import { useState, useEffect } from "react";
import { Collapse, ListGroup, Form, Button } from "react-bootstrap";
import Message from "./Message";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import {useGetLatestClosureDateQuery} from "../slices/clouserDateApiSlice"

const CommentSection = ({
  comments,
  showComments,
  commentText,
  isAnonymous,
  isCommentLoading,
  onCommentTextChange,
  onIsAnonymousChange,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  currentUserId,
}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: closureDateData } = useGetLatestClosureDateQuery();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
  useEffect(() => {
    if (closureDateData && closureDateData.finalClosureDate) {
      const currentDate = new Date();
      const finalClosureDate = new Date(closureDateData.finalClosureDate);
      currentDate.setUTCHours(0, 0, 0, 0); 
      finalClosureDate.setUTCHours(0, 0, 0, 0); 
      setIsButtonDisabled(currentDate >= finalClosureDate);
    }
  }, [closureDateData]);

  return (
    <Collapse in={showComments}>
      <div>
        <h6 className="mt-3">Comments</h6>
        <ListGroup className="mb-3">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <ListGroup.Item key={index} className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {/* Name */}
                    <strong className="text-primary d-block">
                      {comment.isAnonymous ? "Anonymous" : comment.userId.fullName}
                    </strong>

                    {/* Created At (Below Name) */}
                    <small className="text-muted d-block">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>

                    {/* Comment Text */}
                    <p className="mb-0 mt-1">{comment.text}</p>
                  </div>

                  {/* Edit & Delete Buttons */}
                  {(comment.userId._id === currentUserId || userInfo.role?.name === "Admin" || userInfo.role?.name === "QA Manager") && (
                    <div>
                      {/* Show Edit button ONLY for the comment owner */}
                      {comment.userId._id === currentUserId && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => onEditComment(comment._id, comment.text)}
                        >
                          <FaEdit />
                        </Button>
                      )}

                      {/* Show Delete button for the comment owner OR Admin */}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => onDeleteComment(comment._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <Message>No comments yet</Message>
          )}
        </ListGroup>

        <Form>
          <Form.Group controlId="comment" className="mb-2">
            <Form.Control
              as="textarea"
              rows={2}
              value={commentText}
              onChange={onCommentTextChange}
              placeholder="Write your comment..."
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check
              type="checkbox"
              label="Post as Anonymous"
              checked={isAnonymous}
              onChange={onIsAnonymousChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            size="sm"
            onClick={onSubmitComment}
            // disabled={isCommentLoading}
            disabled={isButtonDisabled || isCommentLoading}
          >
            {isCommentLoading ? "Posting..." : "Post Comment"}
          </Button>

          {isButtonDisabled && (
            <p className="text-danger">
              No comments can be posted after the final closure date.
            </p>
          )}

        </Form>
      </div>
    </Collapse>
  );
};

export default CommentSection;