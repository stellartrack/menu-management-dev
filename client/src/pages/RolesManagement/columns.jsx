import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const columns = (handleModal, handleDelete) => [
  {
    name: "Role ID",
    selector: (row) => row.id,
    sortable: true,
    center: "true",
    width: "120px",
  },
  {
    name: "Action",
    width: "100px",
    center: "true",
    cell: (row) => {
      const editTooltipId = `edit-role-${row.id}`;
      const deleteTooltipId = `delete-role-${row.id}`;
      return (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <button className="btn btn-sm action-btn text-primary p-0" onClick={() => handleModal(row)} data-tooltip-id={editTooltipId} data-tooltip-content="Edit">
            <FiEdit size={14} />
          </button>
          <ReactTooltip id={editTooltipId} place="top" effect="solid" />
          <button className="btn btn-sm action-btn text-danger p-0" onClick={() => handleDelete(row)} data-tooltip-id={deleteTooltipId} data-tooltip-content="Delete">
            <FiTrash2 size={14} />
          </button>
          <ReactTooltip id={deleteTooltipId} place="top" effect="solid" />
        </div>
      );
    },
  },
  {
    name: "Role Name",
    selector: (row) => row.name,
    sortable: true,
    wrap: true,
  },
  // {
  //   name: "Cabinet",
  //   selector: (row) => row.cabinetName, // Points to the cabinetName property
  //   sortable: true,
  //   wrap: true,
  // },
];

export default columns;