import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../../hooks/useFolder";
export default function FolderBreadcrumb({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [{ name: "Root", id: null }];
  if (currentFolder) path = [...path, ...currentFolder.path];
  // console.log(path);
  return (
    <Breadcrumb
      className="flex-grow-1"
      listProps={{ className: "bg-white m-0 pl-0" }}
    >
      {path.map((folder, index) => (
        <Breadcrumb.Item
          key={folder.id}
          linkAs={Link}
          linkProps={{
            to:folder.id ? `/folder/${folder.id}` : "/",
            state: { folder: { ...folder, path: path.slice(1, index) } }
          }}
          // linkProps={{
          //   to: {
          //     pathname: folder.id ? `/folder/${folder.id}` : "/",
          //     state: { folder: { ...folder, path: path.slice(1, index) } },
          //   },
          // }}
          className="text-truncate d-inline-block"
          style={{ maxWidth: "150px" }}
        >
          {folder.name}
        </Breadcrumb.Item>
      ))}
      {currentFolder && (
        <Breadcrumb.Item
          // key={folder.id}
          linkAs={Link}
          className="text-truncate d-inline-block"
          active
          style={{ maxWidth: "150px" }}
        >
          {currentFolder.name}
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}
