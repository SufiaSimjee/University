import { Button, OverlayTrigger, Tooltip, Carousel } from "react-bootstrap";
import {
  FaDownload,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";

const isImageFile = (mimeType) => mimeType.startsWith("image/");
const isPdfFile = (mimeType) => mimeType === "application/pdf";
const isWordFile = (mimeType) =>
  mimeType === "application/msword" ||
  mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const isExcelFile = (mimeType) =>
  mimeType === "application/vnd.ms-excel" ||
  mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const isPowerPointFile = (mimeType) =>
  mimeType === "application/vnd.ms-powerpoint" ||
  mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation";

const FileDisplay = ({ fileUrls }) => {
  if (!fileUrls || fileUrls.length === 0) return null;

  const imageFiles = fileUrls.filter((file) => isImageFile(file.mimeType));

  return (
    <div className="mb-3">
      {imageFiles.length >= 2 ? (
        <Carousel>
          {imageFiles.map((file, index) => (
            <Carousel.Item key={index}>
              <img
                src={file.fileUrl}
                alt={`Idea File ${index}`}
                className="d-block w-100"
                style={{ maxHeight: "80%", objectFit: "contain" }}
              />
            </Carousel.Item>
          ))}

          
        </Carousel>
      ) : (
        imageFiles.length === 1 && (
          <img
            src={imageFiles[0].fileUrl}
            alt="Idea File"
            className="img-fluid rounded"
            style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
          />
        )
      )}

      {/* File download buttons */}
      {fileUrls.map((file, index) => (
        <div key={index} className="mb-2">
          {!isImageFile(file.mimeType) && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Download {file.fileName}</Tooltip>}
            >
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                href={file.fileUrl}
                download={file.fileName}
              >
                {isPdfFile(file.mimeType) ? (
                  <>
                    <FaFilePdf /> <span className="ms-1">{file.fileName}</span>
                  </>
                ) : isWordFile(file.mimeType) ? (
                  <>
                    <FaFileWord /> <span className="ms-1">{file.fileName}</span>
                  </>
                ) : isExcelFile(file.mimeType) ? (
                  <>
                    <FaFileExcel /> <span className="ms-1">{file.fileName}</span>
                  </>
                ) : isPowerPointFile(file.mimeType) ? (
                  <>
                    <FaFilePowerpoint /> <span className="ms-1">{file.fileName}</span>
                  </>
                ) : (
                  <>
                    <FaDownload /> <span className="ms-1">{file.fileName}</span>
                  </>
                )}
              </Button>
            </OverlayTrigger>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileDisplay;
