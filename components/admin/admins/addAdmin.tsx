import React, { useCallback, useState } from "react";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import AddAdminModal from "components/admin/admins/addAdminModal";
import newExecutiveMutation from "apollo/queries/executive/newExecutive.gql";
import executivesQuery from "apollo/queries/executive/executives.gql";
import { ExecutiveCreationAttributes } from "@/models/Executive";
import toast from "utils/toast";
import { StopClickDiv } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

const AddAdmin: React.FunctionComponent = () => {
  const [newExecutive] = useMutation(newExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useClipped(modalOpen);

  const promptAdd = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onAdd = useCallback(
    (executive: ExecutiveCreationAttributes) => {
      if (executive.sid.length !== 10) {
        toast.danger("Incorrect sid");
        return;
      }
      setLoading(true);
      newExecutive({ variables: executive })
        .then((payload) => {
          if (!payload.data?.newExecutive.success) {
            throw new Error(
              payload.data?.newExecutive.message ?? "some error occurs"
            );
          }
          toast.success(payload.data.newExecutive.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setModalOpen(false);
        })
        .catch((err) => {
          toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [newExecutive]
  );

  return (
    <StopClickDiv>
      <>
        {modalOpen && (
          <AddAdminModal
            onSave={onAdd}
            onClose={() => {
              setModalOpen(false);
            }}
            loading={loading}
          />
        )}
        <Button color="primary" onClick={promptAdd}>
          Add admin
        </Button>
      </>
    </StopClickDiv>
  );
};

export default AddAdmin;
