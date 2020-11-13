/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useMemo, useCallback } from "react";
import { Row, ColumnInstance } from "react-table";

import _ from "lodash";

interface Props {
  row: Row<Record<string, unknown>>;
  allColumns: ColumnInstance<Record<string, unknown>>[];
  visibleColumns: ColumnInstance<Record<string, unknown>>[];
}

const TableRow = ({
  row,
  allColumns,
  visibleColumns,
}: Props): React.ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hiddenColumns = useMemo(() => {
    return _.difference(allColumns, visibleColumns);
  }, [allColumns, visibleColumns]);

  const expandedHiddenColumns = useMemo(() => {
    if (hiddenColumns.length) {
      return (
        <td colSpan={visibleColumns.length}>
          {hiddenColumns.map((column) => (
            <div key={column.id}>
              <strong>{column.Header}:</strong>
              {row.allCells
                .find((cell) => cell.column.id === column.id)
                ?.render("Cell") ?? ""}
            </div>
          ))}
        </td>
      );
    }
    return <></>;
  }, [hiddenColumns, row, visibleColumns]);

  const rowStyle = useMemo(() => {
    if (hiddenColumns.length) {
      return { cursor: "pointer" };
    }
    return {};
  }, [hiddenColumns]);

  const onRowClick = useCallback(() => {
    if (hiddenColumns.length) {
      setIsExpanded(!isExpanded);
    }
  }, [hiddenColumns, isExpanded]);

  return (
    <>
      <tr {...row.getRowProps()} onClick={onRowClick} style={rowStyle}>
        {row.cells.map((cell) => (
          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
        ))}
      </tr>
      <tr className={!isExpanded ? "is-hidden" : ""} />
      <tr className={!isExpanded ? "is-hidden" : ""}>
        {expandedHiddenColumns}
      </tr>
    </>
  );
};

export default TableRow;
