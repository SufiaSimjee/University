import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";

const VoteButtons = ({ upVotes, downVotes, onUpVote, onDownVote, onCommentToggle }) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <OverlayTrigger placement="top" overlay={<Tooltip>Upvote</Tooltip>}>
        <Button variant="outline-success" size="sm" onClick={onUpVote}>
          <FaThumbsUp /> <span className="ms-1">{upVotes}</span>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Downvote</Tooltip>}>
        <Button variant="outline-danger" size="sm" onClick={onDownVote}>
          <FaThumbsDown /> <span className="ms-1">{downVotes}</span>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Comment</Tooltip>}>
        <Button variant="outline-primary" size="sm" onClick={onCommentToggle}>
          <FaComment />
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default VoteButtons;