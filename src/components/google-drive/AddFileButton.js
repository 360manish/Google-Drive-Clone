import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toast, ProgressBar } from "react-bootstrap";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import React, { useState } from "react";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { useAuth } from "../../context/AuthContext";
import { database } from "../../firebase";
import { v4 as uuidV4 } from "uuid";
// import { storage } from "../../firebase";

export default function AddFileButton({ currentFolder }) {
  const { currentUser } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (currentFolder === null || file === null) return;
    const id = uuidV4();
    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ]);
    const storage = getStorage();
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;

    const fileRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);
    const uploadTask = uploadBytesResumable(fileRef, file);
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     // Observe state change events such as progress, pause, and resume
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //     setUploadingFiles(prevUploadingFiles => {
    //       return prevUploadingFiles.map(uploadFile => {
    //         if (uploadFile.id === id) {
    //           return { ...uploadFile, progress: progress }
    //         }
    //         return uploadFile
    //       })
    //     })
        
    //   },
    //   (error) => {
    //     // Handle unsuccessful uploads
    //     setUploadingFiles(prevUploadingFiles => {
    //       return prevUploadingFiles.map(uploadFile => {
    //         if (uploadFile.id === id) {
    //           return { ...uploadFile, error: true }
    //         }
    //         return uploadFile
    //       })
    //     })
    //   },
    //   () => {
    //     setUploadingFiles(prevUploadingFiles => {
    //       return prevUploadingFiles.filter(uploadFile => {
    //         return uploadFile.id !== id
    //       })
    //     })
    //     // Handle successful uploads on complete
    //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       // console.log("File available at", downloadURL);
    //       database.files
    //         .where("name", "==", file.name)
    //         .where("userId", "==", currentUser.uid)
    //         .where("folderId", "==", currentFolder.id)
    //         .get()
    //         .then((existingFiles) => {
    //           const existingFile = existingFiles.docs[0];
    //           if (existingFile) {
    //             existingFile.ref.update({ url: downloadURL });
    //           } else {
    //             database.files.add({
    //               url: downloadURL,
    //               name: file.name,
    //               createdAt: database.getCurrentTimestamp(),
    //               folderId: currentFolder.id,
    //               userId: currentUser.uid,
    //             });
    //           }
    //         });
    //     });
    //   }
    // );
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes
        console.log("upload progress is",progress,"%")
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress }
            }
            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles(prevUploadingFiles => {
          prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.filter(uploadFile => {
            return uploadFile.id !== id
          })
        })

        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          database.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then(existingFiles => {
              const existingFile = existingFiles.docs[0]
              if (existingFile) {
                existingFile.ref.update({ url: url })
              } else {
                database.files.add({
                  url: url,
                  name: file.name,
                  createdAt: database.getCurrentTimestamp(),
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
                })
              }
            })
        })
      }
    )
  }
  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map(file => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                      return uploadFile.id !== file.id
                    })
                  })
                }}
              >
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
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}
