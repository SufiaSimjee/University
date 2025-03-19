import { useDownloadIdeasMutation } from '../slices/ideasApiSlice';
import { Button} from "react-bootstrap";
const DownloadButton = () => {
  const [downloadIdeas, { isLoading, isError, error }] = useDownloadIdeasMutation();

  const handleDownload = async () => {
    try {
      const fileBlob = await downloadIdeas().unwrap(); 
      const fileURL = URL.createObjectURL(fileBlob); 

      const a = document.createElement('a'); 
      a.href = fileURL; 
      a.download = 'ideas.zip'; 
      a.click(); 
      URL.revokeObjectURL(fileURL); 
    } catch (err) {
      console.error('Error downloading the file:', err);
    }
  };

  return (
    <div>
      <Button 
        onClick={handleDownload} 
        disabled={isLoading} 
        className="download-button mb-3"
      >
        {isLoading ? 'Downloading...' : 'Download Ideas'}
      </Button>

      {isError && <p style={{ color: 'red' }}>Error: {error?.message}</p>}
    </div>
  );
};

export default DownloadButton;
