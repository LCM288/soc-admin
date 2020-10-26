import React, { useState } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import EditPersonModal from "components/admin/table/editPersonModal";
import { Person } from "@/models/Person";

const EditCell = ({
  row,
}: CellProps<Record<string, unknown>, number>): React.ReactElement => {
  console.log(Person);
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
