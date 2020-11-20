import React, { useState, useMemo, useCallback } from "react";
import { Row, ColumnInstance } from "react-table";
import TableCell from "components/admin/table/tableCell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

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
        <td
          colSpan={visibleColumns.length + 1}
          style={{
            maxWidth: "1px", // this is a hack for table data cell
            overflow: "auto",
          }}
        >
          {row.allCells
            .filter((cell) =>
              hiddenColumns.map((column) => column.id).includes(cell.column.id)
            )
            .map((cell) => (
              <div key={cell.column.id}>
                <strong>{cell.column.Header}: </strong>
                {cell.render("Cell", { isHidden: true, isExpanded })}
              </div>
            ))}
        </td>
      );
    }
    return <></>;
  }, [hiddenColumns, row, visibleColumns, isExpanded]);

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
          <TableCell cell={cell} key={cell.column.id} />
        ))}
        {Boolean(hiddenColumns.length) && (
          <td style={{ width: 1, maxWidth: 1 }}>
            <FontAwesomeIcon icon={isExpanded ? faMinus : faPlus} />
          </td>
        )}
      </tr>
      <tr className={!isExpanded ? "is-hidden" : ""} />
      <tr className={!isExpanded ? "is-hidden" : ""}>
        {expandedHiddenColumns}
      </tr>
    </>
  );
};

export default TableRow;
