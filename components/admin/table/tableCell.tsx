import React, { useRef, useEffect, useState } from "react";
import { Cell } from "react-table";

interface Props {
  cell: Cell<Record<string, unknown>>;
}

const TableCell = ({ cell }: Props): React.ReactElement => {
  const dataCell = useRef<HTMLDivElement | null>(null);
  const [dataCellOverflow, setDataCellOverflow] = useState(false);
  useEffect(() => {
    if (!dataCell.current) {
      // eslint-disable-next-line no-console
      console.error("tableDataCell not mounted");
      return;
    }
    const overflow =
      dataCell.current.clientWidth < dataCell.current.scrollWidth;
    if (overflow !== dataCellOverflow) {
      setDataCellOverflow(overflow);
    }
  }, [dataCellOverflow]);
  return (
    <td
      {...cell.getCellProps()}
      style={{
        width: cell.column.width,
        maxWidth: cell.column.maxWidth,
        minWidth: cell.column.minWidth,
      }}
    >
      <div
        className="dropdown is-hoverable"
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <div
          ref={dataCell}
          className="dropdown-trigger"
          style={{ overflow: "hidden" }}
        >
          {cell.render("Cell")}
        </div>
        {dataCellOverflow && (
          <>
            ...
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <div className="dropdown-item">{cell.render("Cell")}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </td>
  );
};

export default TableCell;
