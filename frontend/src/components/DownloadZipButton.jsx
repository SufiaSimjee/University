import { Button } from 'react-bootstrap';
import {FaFileZipper} from 'react-icons/fa6';
import { useDownloadAllFilesAsZipMutation } from "../slices/fileDownloadApiSlice";
import { toast } from 'react-toastify'; 

const DownloadZipButton = () => {
    const [downloadZip] = useDownloadAllFilesAsZipMutation();

    const handleDownloadZip = async () => {
        try {
            const response = await downloadZip().unwrap();

        
            if (response?.message === 'No files found in the collection') {
                toast.warn('No files found in the collection');
                return;
            }

            const blob = new Blob([response], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'all_files.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('ZIP Download failed:', error);
            toast.error('No files found in the collection');
        }
    };

    return (
        <Button onClick={handleDownloadZip} className="btn btn-warning mb-4 ms-2">
            <FaFileZipper/> Download Files as ZIP
        </Button>
    );
};

export default DownloadZipButton;
