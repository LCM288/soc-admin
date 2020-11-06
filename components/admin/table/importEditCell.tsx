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
  setCanExpand: (newValue: boolean) => void;
}

const ImportEditCell = ({
  row,
  value: title,
  updateMemberData,
  setCanExpand,
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
      setCanExpand(true);
    },
    [row, updateMemberData, setCanExpand]
  );
  const promptEdit = () => {
    setOpenModal(true);
    setCanExpand(false);
  };
  const cancelEdit = () => {
    setOpenModal(false);
    setCanExpand(true);
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
