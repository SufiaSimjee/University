import { Button } from 'react-bootstrap';
import {FaFileCsv} from 'react-icons/fa';
import {useDownloadusercsvforqaMutation } from "../slices/fileDownloadApiSlice";

const DownloadCSVForQAButton = () => {
    const [downloadCsv] = useDownloadusercsvforqaMutation();

    const handleDownloadCsv = async () => {
        try {
            const response = await downloadCsv().unwrap();
            const blob = new Blob([response], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('CSV Download failed:', error);
        }
    };

    return (
        <Button onClick={handleDownloadCsv} className="btn btn-warning mb-3 ms-2">
            <FaFileCsv/> Download In CSV
        </Button>
    );
};

export default DownloadCSVForQAButton;