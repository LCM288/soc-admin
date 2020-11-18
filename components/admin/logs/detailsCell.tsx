import React, { useMemo, useCallback } from "react";
import { CellProps } from "react-table";
import { union } from "lodash";
import { DateTime } from "luxon";

type Props = CellProps<Record<string, unknown>, string>;

const DetailsCell = ({
  row: {
    original: { oldValue, newValue, table },
  },
}: Props): React.ReactElement => {
  const oldObject = useMemo<Record<string, string>>(
    () => JSON.parse(oldValue as string),
    [oldValue]
  );

  const newObject = useMemo<Record<string, string>>(
    () => JSON.parse(newValue as string),
    [newValue]
  );

  const keys = useMemo(
    () => union(Object.keys(oldObject), Object.keys(newObject)),
    [oldObject, newObject]
  );

  const renderValue = useCallback((value: string) => {
    if (!value) {
      return <i className="has-text-grey-lighter">No value</i>;
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return DateTime.fromISO(value).toLocaleString(
        DateTime.DATETIME_SHORT_WITH_SECONDS
      );
    }
    return value;
  }, []);
  return (
    <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th>{table as string}</th>
          <th>Old value</th>
          <th>New value</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{renderValue(oldObject?.[key])}</td>
            <td>{renderValue(newObject?.[key])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DetailsCell;
