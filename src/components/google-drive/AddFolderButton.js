import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { database } from "../../firebase";
import {useAuth} from '../../context/AuthContext'
import { icon } from "@fortawesome/fontawesome-svg-core";
import { ROOT_FOLDER } from "../../hooks/useFolder";
export default function AddFolderButton({currentFolder}) {
    const {currentUser}=useAuth()
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  const handleSubmit=(e)=>{
    e.preventDefault()
    if(currentFolder==null)return;

    const path=[...currentFolder.path]
    if(currentFolder !== ROOT_FOLDER){
      path.push({name:currentFolder.name, id:currentFolder.id})
    }
    database.folders.add({
        name:name,
        parentId:currentFolder.id,
        userId:currentUser.uid,
        path:path,
        createdAt:database.getCurrentTimestamp()
    })
    setName("")
    closeModal()
  }
  return (
    <>
      <Button className="my-4" onClick={openModal} variant="outline-success">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
                Close
            </Button>
            <Button variant="success" type="sumbmit">Add Folder</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
