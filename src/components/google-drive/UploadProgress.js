import React from 'react'
import { Toast, ProgressBar } from "react-bootstrap";
import * as ReactDOM from 'react-dom';
export default function UploadProgress({uploadingFiles}) {
  return (
    ReactDOM.createPortal(
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            maxWidth: "250px",
          }}
        >
          {uploadingFiles.map((file) => {
            <Toast key={file.id}>
              <Toast.Header
                closeButton={file.error}
                className="text-truncate w-100 d-block"
              >
                {file.name}
              </Toast.Header>
              <Toast.Body>
                <ProgressBar
                  animated={!file.error}
                  variant={file.error ? "danger" : "primary"}
                  now={file.error ? 100 : file.progress * 100}
                  label={
                    file.error
                      ? "Error"
                      : `${Math.round(file.progress * 100)}%`
                  }
                />
              </Toast.Body>
            </Toast>;
          })}
        </div>,
        document.body
      )
      )
}
