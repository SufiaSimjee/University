import { useSelector } from 'react-redux';
import { useDeleteIdeaMutation } from '../slices/ideasApiSlice';
import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DeleteIdeaButton = ({ ideaId }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [deleteIdea, { isLoading }] = useDeleteIdeaMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteIdea(ideaId).unwrap();
        navigate('/ideas');
        toast.success('Idea deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete idea');
      }
    }
  };

  if (!userInfo || (userInfo.role.name !== 'Admin' && userInfo.role.name !== 'QA Manager')) {
    return null; 
  }

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={isLoading}
      className='mb-2'
    >
      {isLoading ? 'Deleting...' : <FaTrash />}
    
    </Button>
  );
};

export default DeleteIdeaButton;
