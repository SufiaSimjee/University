import { Button } from 'react-bootstrap';
import { FaFileDownload } from 'react-icons/fa';
import { useDownloadAllFilesAsZipMutation, useDownloadcsvMutation } from "../slices/fileDownloadApiSlice";
import { toast } from 'react-toastify';

const DownloadButton = () => {
    const [downloadZip] = useDownloadAllFilesAsZipMutation();
    const [downloadCsv] = useDownloadcsvMutation();

    const handleDownload = async () => {
        try {
            const [csvResponse, zipResponse] = await Promise.allSettled([
                downloadCsv().unwrap(),
                downloadZip().unwrap()
            ]);

            const downloadFile = (blob, fileName) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            };

            let filesDownloaded = false;

            // Handle CSV response
            if (csvResponse.status === "fulfilled") {
                if (csvResponse.value?.message === 'No ideas found') {
                    toast.warn('No ideas available for download', { position: "top-right" });
                } else {
                    const csvBlob = new Blob([csvResponse.value], { type: 'text/csv' });
                    downloadFile(csvBlob, 'ideas.csv');
                    filesDownloaded = true;
                }
            } else {
                toast.error('Failed to download CSV', { position: "top-right" });
            }

            // Handle ZIP response
            if (zipResponse.status === "fulfilled") {
                if (zipResponse.value?.message === 'No files found in the collection') {
                    toast.warn('No files available for download', { position: "top-right" });
                } else {
                    const zipBlob = new Blob([zipResponse.value], { type: 'application/zip' });
                    downloadFile(zipBlob, 'all_files.zip');
                    filesDownloaded = true;
                }
            } else {
                toast.error('No files exit', { position: "top-right" });
            }

            if (!filesDownloaded) {
                toast.info('No files were downloaded.', { position: "top-right" });
            }

        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Download failed. Please try again.', { position: "top-right" });
        }
    };

    return (
        <Button onClick={handleDownload} className="btn btn-warning mb-4">
            <FaFileDownload /> Download CSV AND ZIP
        </Button>
    );
};

export default DownloadButton;
