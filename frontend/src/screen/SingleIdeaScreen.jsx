import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetIdeaByIdQuery,
  useCreateCommentMutation,
  useUpVoteIdeaMutation,
  useDownVoteIdeaMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "../slices/ideasApiSlice";
import { Card, Modal, Button } from "react-bootstrap"; 
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from "../components/Message";
import IdeaHeader from "../components/IdeaHeader";
import FileDisplay from "../components/FileDisplay";
import VoteButtons from "../components/VoteButton";
import CommentSection from "../components/CommentSection";

const SingleIdeaScreen = () => {
  const { ideaId } = useParams();
  const { data: idea, isLoading, error, refetch } = useGetIdeaByIdQuery(ideaId);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [commentToDelete, setCommentToDelete] = useState(null); 

  const { userInfo } = useSelector((state) => state.auth);
  const [createComment, { isLoading: isCommentLoading }] = useCreateCommentMutation();
  const [upVoteIdea] = useUpVoteIdeaMutation();
  const [downVoteIdea] = useDownVoteIdeaMutation();
  const [updateComment] = useUpdateCommentMutation(); 
  const [deleteComment] = useDeleteCommentMutation(); 

  const handleCommentToggle = () => {
    setShowComments((prev) => !prev);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment({
        ideaId,
        commentData: {
          userId: userInfo._id,
          text: commentText,
          isAnonymous,
        },
      }).unwrap();

      toast.success("Comment submitted successfully");
      setCommentText("");
      setIsAnonymous(false);
      refetch(); 
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = async (commentId, currentText) => {
    setCommentText(currentText); 
    setEditingCommentId(commentId); 
  };

  const handleUpdateComment = async () => {
    if (!commentText.trim()) return;

    try {
      await updateComment({
        ideaId,
        commentId: editingCommentId,
        text: commentText,
      }).unwrap();

      toast.success("Comment updated successfully");
      setCommentText("");
      setEditingCommentId(null); 
      refetch(); 
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteConfirmation = (commentId) => {
    setCommentToDelete(commentId); 
    setShowDeleteModal(true); 
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment({ ideaId, commentId: commentToDelete }).unwrap();
      toast.success("Comment deleted successfully");
      refetch(); 
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setShowDeleteModal(false); 
      setCommentToDelete(null); 
    }
  };

  const handleUpVote = async () => {
    try {
      await upVoteIdea({ ideaId, userId: userInfo._id }).unwrap();
      toast.success("Upvoted successfully!");
    } catch (error) {
      toast.error("Failed to upvote");
    }
  };

  const handleDownVote = async () => {
    try {
      await downVoteIdea({ ideaId, userId: userInfo._id }).unwrap();
      toast.success("Downvoted successfully!");
    } catch (error) {
      toast.error("Failed to downvote");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Idea Details</h1>

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          {/* Idea Header */}
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
          <IdeaHeader
            title={idea.title}
            description={idea.description}
            category={idea.category}
            showAllDepartments={idea.showAllDepartments}
            departments={idea.userId.departments}
          />

          {/* File Display */}
          <FileDisplay fileUrls={idea.fileUrls} />

          {/* Vote Buttons */}
          <VoteButtons
            upVotes={idea.upVotes.length}
            downVotes={idea.downVotes.length}
            onUpVote={handleUpVote}
            onDownVote={handleDownVote}
            onCommentToggle={handleCommentToggle}
          />

          {/* Comment Section */}
          <CommentSection
            comments={[...idea.comments].reverse()}
            showComments={showComments}
            commentText={commentText}
            isAnonymous={isAnonymous}
            isCommentLoading={isCommentLoading}
            onCommentTextChange={(e) => setCommentText(e.target.value)}
            onIsAnonymousChange={(e) => setIsAnonymous(e.target.checked)}
            onSubmitComment={editingCommentId ? handleUpdateComment : handleCommentSubmit} 
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteConfirmation} 
            currentUserId={userInfo._id} 
          />
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SingleIdeaScreen;