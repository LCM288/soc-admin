import React, { useState, useCallback } from "react";
import { Button } from "react-bulma-components";
import EditPersonModal from "components/admin/table/editPersonModal";
import { PersonUpdateAttributes } from "@/models/Person";
import _ from "lodash";

const ImportEditCell = ({
  row,
  value: title,
  dataUpdate,
}: any): React.ReactElement => {
  const [editLoading, setEditLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const onSave = useCallback(
    (person: PersonUpdateAttributes) => {
      const diff = _.fromPairs(
        _.compact(
          _.toPairs(person).map(([key, value]) =>
            row.values[key] && row.values[key] === value ? null : [key, value]
          )
        )
      );
      dataUpdate(row.index, diff);
      setOpenModal(false);
    },
    [row, dataUpdate]
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
