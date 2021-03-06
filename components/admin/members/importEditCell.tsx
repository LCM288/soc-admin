import React, { useState, useCallback } from "react";
import { Button } from "react-bulma-components";
import EditPersonModal from "components/admin/members/editPersonModal";
import { PersonUpdateAttributes } from "@/models/Person";
import { CellProps } from "react-table";
import toast from "utils/toast";
import { StopClickDiv } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

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

  useClipped(openModal);

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

  const promptEdit = useCallback(() => {
    setOpenModal(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <StopClickDiv>
      <>
        {openModal && (
          <EditPersonModal
            onSave={onSave}
            onCancel={cancelEdit}
            row={row.values}
            loading={editLoading}
            title={title}
            fullyEditable
          />
        )}
        <Button color="info" onClick={promptEdit}>
          Edit
        </Button>
      </>
    </StopClickDiv>
  );
};

export default ImportEditCell;
