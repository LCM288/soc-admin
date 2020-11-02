import React, { useCallback, useState } from "react";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import AddAdminModal from "components/admin/admins/addAdminModal";
import newExecutiveMutation from "apollo/queries/executive/newExecutive.gql";
import executivesQuery from "apollo/queries/executive/executives.gql";
import { ExecutiveCreationAttributes } from "@/models/Executive";
import toast from "utils/toast";

interface Props {
  executives: Array<Record<string, unknown>>;
}

const AddAdmin: React.FunctionComponent<Props> = ({ executives }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newExecutive] = useMutation(newExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });

  const proptAdd = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onAdd = useCallback(
    (executive: ExecutiveCreationAttributes) => {
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
    <>
      {modalOpen && (
        <AddAdminModal
          executives={executives}
          onSave={onAdd}
          onClose={() => {
            setModalOpen(false);
          }}
          loading={loading}
        />
      )}
      <Button color="primary" onClick={proptAdd}>
        Add person
      </Button>
    </>
  );
};

export default AddAdmin;
