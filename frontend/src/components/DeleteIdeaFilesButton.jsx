import { Button } from 'react-bootstrap';
import { useDeleteIdeaFilesByIdMutation } from '../slices/ideasApiSlice';
import {FaTrash} from 'react-icons/fa';
import { toast } from 'react-toastify';

const DeleteIdeaFilesButton = ({ ideaId }) => {
  const [deleteIdeaFilesById, { isLoading }] = useDeleteIdeaFilesByIdMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete all files for this idea?')) {
      try {
        await deleteIdeaFilesById(ideaId).unwrap();
        toast.success('Idea files deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete files');
      }
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete} disabled={isLoading}
    className='mb-3'>
      {isLoading ? 'Deleting...' : (
        <>
          <FaTrash className="me-2" />
          Delete Files
        </>
      )}
    </Button>
  );
};

export default DeleteIdeaFilesButton;
