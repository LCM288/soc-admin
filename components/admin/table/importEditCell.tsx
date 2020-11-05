import React, { useState, useCallback } from "react";
import { Button } from "react-bulma-components";
import EditPersonModal from "components/admin/table/editPersonModal";
import { PersonUpdateAttributes } from "@/models/Person";
import { CellProps } from "react-table";
import toast from "utils/toast";

interface Props extends CellProps<Record<string, unknown>, string> {
  updateMemberData: (
    rowIndex: number,
    updatedPerson: PersonUpdateAttributes
  ) => void;
}

const ImportEditCell = ({
  row,
  value: title,
  updateMemberData,
}: Props): React.ReactElement => {
  const [editLoading, setEditLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const onSave = useCallback(
    (person: PersonUpdateAttributes) => {
      if (person.sid.length !== 10) {
        toast.danger("Incorrect sid");
        return;
      }
      setEditLoading(true);
      updateMemberData(row.index, person);
      setEditLoading(false);
      setOpenModal(false);
    },
    [row, updateMemberData]
  );
  const promptEdit = () => {
    setOpenModal(true);
  };
  const cancelEdit = () => {
    setOpenModal(false);
  };
  return (
    <>
      {openModal && (
        <EditPersonModal
          onSave={onSave}
          onCancel={cancelEdit}
          row={row.values}
          loading={editLoading}
          title={title}
          sidEditable
        />
      )}
      <Button color="info" onClick={promptEdit}>
        Edit
      </Button>
    </>
  );
};

export default ImportEditCell;
