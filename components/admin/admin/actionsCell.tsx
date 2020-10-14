import React, { useState } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import updateExecutiveMutation from "apollo/queries/executive/updateExecutive.gql";
import deleteExecutiveMutation from "apollo/queries/executive/deleteExecutive.gql";
import executivesQuery from "apollo/queries/executive/executives.gql";
import toast from "utils/toast";

const ActionsCell = (
  instance: CellProps<Record<string, unknown>, string>
): React.ReactElement => {
  const { row, cell } = instance;
  const [updateExecutive] = useMutation(updateExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });
  const [deleteExecutive] = useMutation(deleteExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });

  const [loading, setLoading] = useState(false);

  const onEdit = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // @ts-expect-error react-table types not updated
    cell.setState(true);
  };
  const onSave = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // @ts-expect-error react-table types not updated
    cell.setState(false);
    setLoading(true);
    // @ts-expect-error react-table types not updated
    const { sid, nickname, pos } = row.state.cellState;
    updateExecutive({ variables: { sid, nickname, pos } })
      .then((payload) => {
        if (!payload.data?.updateExecutive.success) {
          throw new Error(
            payload.data?.updateExecutive.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.updateExecutive.message, {
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
  const onCancel = () => {
    // @ts-expect-error react-table types not updated
    cell.setState(false);
    // @ts-expect-error react-table types not updated
    const { sid, nickname, pos } = row.state.row;
    // @ts-expect-error react-table types not updated
    instance.setCellState(sid, "sid", sid);
    // @ts-expect-error react-table types not updated
    instance.setCellState(sid, "nickname", nickname);
    // @ts-expect-error react-table types not updated
    instance.setCellState(sid, "pos", pos);
  };
  const onDelete = () => {
    const { sid } = row.values;
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

  // @ts-expect-error react-table types not updated
  if (row.state.cellState.edit)
    return (
      <>
        <Button
          type="submit"
          color="success"
          onClick={onSave}
          loading={loading}
        >
          Save
        </Button>

        <Button color="danger" onClick={onCancel}>
          Cancel
        </Button>
      </>
    );
  return (
    <>
      <Button color="primary" onClick={onEdit}>
        Edit
      </Button>
      <Button color="danger" onClick={onDelete} loading={loading}>
        Delete
      </Button>
    </>
  );
};

export default ActionsCell;
