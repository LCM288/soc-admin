/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useMemo, useCallback, useEffect } from "react";

import _ from "lodash";

const TableRow = ({
  row,
  allColumns,
  visibleColumns,
}: any): React.ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hiddenColumns = useMemo(() => {
    return _.difference(allColumns, visibleColumns);
  }, [allColumns, visibleColumns]);

  const expanded = () => {
    if (hiddenColumns.length) {
      return (
        <td colSpan={visibleColumns.length}>
          {hiddenColumns.map((column: { Header: string; id: number }) => {
            return (
              <p>
                <strong>{column.Header}:</strong> {row.values[column.id]}
              </p>
            );
          })}
        </td>
      );
    }
    return null;
  };

  const rowStyle = useMemo(() => {
    if (hiddenColumns.length) {
      return { cursor: "pointer" };
    }
    return {};
  }, [hiddenColumns]);

  const onRowClick = () => {
    if (hiddenColumns.length) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      <tr {...row.getRowProps()} onClick={onRowClick} style={rowStyle}>
        {row.cells.map(
          (cell: {
            getCellProps: () => Record<string, unknown>;
            render: (string: string) => HTMLElement;
          }) => {
            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
          }
        )}
      </tr>
      <tr className={!isExpanded ? "is-hidden" : ""} />
      <tr className={!isExpanded ? "is-hidden" : ""}>{expanded()}</tr>
    </>
  );
};

export default TableRow;
