import React from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";

const ActionsCell = ({
  row,
  cell,
}: CellProps<Record<string, unknown>, string>): React.ReactElement => {
  const onEdit = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // @ts-expect-error react-table types not updated
    cell.setState(true);
  };
  const onSave = (e: React.ChangeEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // @ts-expect-error react-table types not updated
    cell.setState(false);
  };
  // @ts-expect-error react-table types not updated
  if (row.state.cellState.edit)
    return (
      <>
        <Button type="submit" color="success" onClick={onSave}>
          Save
        </Button>

        <Button color="danger">Cancel</Button>
      </>
    );
  return (
    <Button color="primary" onClick={onEdit}>
      Edit
    </Button>
  );
};

export default ActionsCell;
