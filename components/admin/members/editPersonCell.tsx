import React, { useState, useCallback } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import EditPersonModal from "components/admin/members/editPersonModal";
import { PersonUpdateAttributes } from "@/models/Person";
import updatePersonMutation from "apollo/queries/person/updatePerson.gql";
import { useMutation } from "@apollo/react-hooks";
import membersQuery from "apollo/queries/person/members.gql";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import toast from "utils/toast";
import { StopClickDiv } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

type Props = CellProps<Record<string, unknown>, string>;

const EditPersonCell = ({ row, value: title }: Props): React.ReactElement => {
  const [updatePerson] = useMutation(updatePersonMutation, {
    refetchQueries: [{ query: membersQuery }, { query: registrationsQuery }],
  });

  const [editLoading, setEditLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useClipped(openModal);

  const onSave = useCallback(
    (person: PersonUpdateAttributes) => {
      setEditLoading(true);
      updatePerson({ variables: person })
        .then((payload) => {
          if (!payload.data?.updatePerson.success) {
            throw new Error(
              payload.data?.updatePerson.message ?? "some error occurs"
            );
          }
          toast.success(payload.data.updatePerson.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setOpenModal(false);
        })
        .catch((err) => {
          toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
        })
        .finally(() => {
          setEditLoading(false);
        });
    },
    [updatePerson]
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
          />
        )}
        <Button color="info" onClick={promptEdit}>
          Edit
        </Button>
      </>
    </StopClickDiv>
  );
};

export default EditPersonCell;
