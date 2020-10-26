import React, { useState } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import EditPersonModal from "components/admin/table/editPersonModal";

const EditCell = ({
  row,
}: CellProps<Record<string, unknown>, number>): React.ReactElement => {
  const [openModal, setOpenModal] = useState(false);
  const save = () => {};
  const promptEdit = () => {
    setOpenModal(true);
  };
  const cancelEdit = () => {
    setOpenModal(false);
  };
  return (
    <>
      {openModal && (
        <EditPersonModal onSave={save} onCancel={cancelEdit} row={row.values} />
      )}
      <Button color="success" onClick={promptEdit}>
        Edit
      </Button>
    </>
  );
};

export default EditCell;
