import React, { useCallback, useState } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import updateExecutiveMutation from "apollo/queries/executive/updateExecutive.gql";
import deleteExecutiveMutation from "apollo/queries/executive/deleteExecutive.gql";
import executivesQuery from "apollo/queries/executive/executives.gql";
import toast from "utils/toast";
import { ExecutiveUpdateAttributes } from "@/models/Executive";
import EditAdminModal from "components/admin/admin/editAdminModal";
import PromptModal from "components/promptModal";
import Loading from "components/loading";

const ActionsCell = ({
  row,
}: CellProps<Record<string, unknown>, string>): React.ReactElement => {
  const [updateExecutive] = useMutation(updateExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });
  const [deleteExecutive] = useMutation(deleteExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });

  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const onSave = useCallback(
    (executive: ExecutiveUpdateAttributes) => {
      setLoading(true);
      updateExecutive({ variables: executive })
        .then((payload) => {
          if (!payload.data?.updateExecutive.success) {
            throw new Error(
              payload.data?.updateExecutive.message ?? "some error occurs"
            );
          }
          toast.success(payload.data.updateExecutive.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setOpenEditModal(false);
        })
        .catch((err) => {
          toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [updateExecutive]
  );
  const promptEdit = useCallback(() => {
    setOpenEditModal(true);
  }, []);
  const cancelEdit = useCallback(() => {
    setOpenEditModal(false);
  }, []);
  const onDelete = () => {
    const { sid } = row.values;
    setOpenDeleteModal(false);
    setLoading(true);
    deleteExecutive({ variables: { sid } })
      .then((payload) => {
        if (!payload.data?.deleteExecutive.success) {
          throw new Error(
            payload.data?.deleteExecutive.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.deleteExecutive.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .catch((err) => {
        toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const promptDelete = useCallback(() => {
    setOpenDeleteModal(true);
  }, []);
  const cancelDelete = useCallback(() => {
    setOpenDeleteModal(false);
  }, []);

  return (
    <>
      {openEditModal && (
        <EditAdminModal
          onSave={onSave}
          onCancel={cancelEdit}
          row={row.values}
          loading={loading}
        />
      )}
      {openDeleteModal && (
        <PromptModal
          message={`Are you sure to remove ${row.values.sid} from the admin list ?`}
          onConfirm={onDelete}
          onCancel={cancelDelete}
        />
      )}
      <Button color="info" onClick={promptEdit}>
        Edit
      </Button>
      <Button color="danger" onClick={promptDelete}>
        Delete
      </Button>
      {!openEditModal && <Loading loading={loading} />}
    </>
  );
};

export default ActionsCell;
