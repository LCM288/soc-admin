import React, { useCallback } from "react";
import { HeaderGroup } from "react-table";
import { LogHeaderGroup } from "utils/useLogTable";
import { MemberHeaderGroup } from "utils/useMemberTable";
import { RegistrationHeaderGroup } from "utils/useRegistrationTable";
import { SocSettingHeaderGroup } from "utils/useSocSettingTable";

type SortableHeaderGroup = MemberHeaderGroup | RegistrationHeaderGroup;

type UnsortableHeaderGroup =
  | HeaderGroup
  | LogHeaderGroup
  | SocSettingHeaderGroup;

interface Props {
  headerGroups: UnsortableHeaderGroup[] | SortableHeaderGroup[];
  tableColumns: { id: string; disableSortBy?: boolean }[];
  tableSortable: boolean;
}

const TableHead = ({
  headerGroups,
  tableColumns,
  tableSortable,
}: Props): React.ReactElement => {
  const sortDirectionIndicatior = useCallback(
    (column) => {
      if (!tableSortable) {
        return "";
      }
      const sortableColumn = column as SortableHeaderGroup;
      if (sortableColumn.isSorted) {
        if (sortableColumn.isSortedDesc) {
          return " 🔽";
        }
        return " 🔼";
      }
      return "";
    },
    [tableSortable]
  );

  return (
    <thead>
      {(headerGroups as unknown[]).map(
        (headerGroup: SortableHeaderGroup | UnsortableHeaderGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {(headerGroup.headers as unknown[]).map(
              (column: SortableHeaderGroup | UnsortableHeaderGroup) => (
                <th
                  {...(tableSortable
                    ? column.getHeaderProps(
                        (column as SortableHeaderGroup).getSortByToggleProps()
                      )
                    : column.getHeaderProps())}
                  style={{
                    width: column.width,
                    maxWidth: column.maxWidth,
                    minWidth: column.minWidth,
                    position: "sticky",
                    top: "3rem",
                    zIndex: 1,
                  }}
                  className={`has-background-light ${
                    tableSortable &&
                    tableColumns.find(
                      (tableColumn) => tableColumn.id === column.id
                    )?.disableSortBy
                      ? ""
                      : "is-clickable"
                  }`}
                >
                  {column.render("Header")}
                  <span>{sortDirectionIndicatior}</span>
                </th>
              )
            )}
            <td
              className="has-background-light"
              style={{
                width: "1px",
                maxWidth: "1px",
                padding: 0,
                position: "sticky",
                top: "3rem",
                zIndex: 1,
              }}
            />
          </tr>
        )
      )}
    </thead>
  );
};

export default TableHead;
