import React, { useState } from "react";
import _ from "lodash";
import { CellProps } from "react-table";
import { Form } from "react-bulma-components";

const { Input } = Form;

const EditableCell = ({
  value: initialValue,
  // @ts-expect-error react-table types not updated
  row: { state },
  cell,
}: CellProps<Record<string, unknown>, string>): React.ReactElement => {
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    // @ts-expect-error react-table types not updated
    cell.setState(e.target.value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    // @ts-expect-error react-table types not updated
    if (_.isObject(cell.state)) cell.setState(initialValue);
  }, [cell, initialValue]);

  return (
    <Input
      isStatic={!state.cellState.edit}
      // @ts-expect-error react-table types not updated
      value={cell.state || initialValue}
      onChange={onChange}
    />
  );
};
export default EditableCell;
