import React, { useMemo, useState, useCallback, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import useAdminTable, { AdminColumnInstance } from "utils/useAdminTable";
import { CellProps } from "react-table";
import { useQuery } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { Table, Level } from "react-bulma-components";
import toast from "utils/toast";
import executivesQuery from "apollo/queries/executive/executives.gql";
import ActionsCell from "components/admin/admins/actionsCell";
import AddAdmin from "components/admin/admins/addAdmin";
import TableRow from "components/admin/table/tableRow";
import { cloneDeep, compact } from "lodash";
import Loading from "components/loading";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  // constants
  const getSortDirectionIndicatior = useCallback(
    (column: AdminColumnInstance) => {
      if (column.isSorted) {
        if (column.isSortedDesc) {
          return " 🔽";
        }
        return " 🔼";
      }
      return "";
    },
    []
  );

  // data
  const { data, loading, error } = useQuery(executivesQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [executivesData, setExecutivesData] = useState<
    { executives: Record<string, unknown>[] } | undefined
  >(undefined);

  useEffect(() => {
    setExecutivesData(data);
  }, [data]);
  useEffect(() => {
    if (error) {
      toast.danger(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [error]);

  // table
  const tableColumns = useMemo(
    () => [
      {
        Header: "SID",
        accessor: "sid",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Nickname",
        accessor: "nickname",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Position",
        accessor: "pos",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Action",
        id: "action",
        Cell: (props: CellProps<Record<string, unknown>, string>) => (
          <ActionsCell {...props} user={user} />
        ),
        disableSortBy: true,
        minWidth: 170,
        width: 170,
        maxWidth: 170,
      },
    ],
    [user]
  );

  const tableData = useMemo(() => {
    return executivesData?.executives ?? [];
  }, [executivesData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => row.sid as string;
  }, []);

  const tableInstance = useAdminTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
    allColumns,
    visibleColumns,
  } = tableInstance;

  // resize
  const [resizeListener, sizes] = useResizeAware();

  const hideColumnOrder = useMemo(
    () => [["pos"], ["nickname"], ["action"]],
    []
  );

  useEffect(() => {
    let newHideColumn: string[] = [];
    let maxWidth =
      54 +
      tableColumns.map((column) => column.width).reduce((a, b) => a + b, 0);
    const columnsToHide = cloneDeep(hideColumnOrder);
    while (sizes.width < maxWidth && columnsToHide.length) {
      newHideColumn = newHideColumn.concat(columnsToHide[0]);
      maxWidth -= compact(
        columnsToHide[0].map((columnId) =>
          tableColumns.find(
            (column) => column.id === columnId || column.accessor === columnId
          )
        )
      )
        .map((column) => column.width)
        .reduce((a, b) => a + b, 0);
      columnsToHide.splice(0, 1);
    }
    setHiddenColumns(newHideColumn);
  }, [sizes.width, hideColumnOrder, tableColumns, setHiddenColumns]);

  if (user) {
    return (
      <>
        {resizeListener}
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      width: column.width,
                      maxWidth: column.maxWidth,
                      minWidth: column.minWidth,
                    }}
                  >
                    {column.render("Header")}
                    <span>{getSortDirectionIndicatior(column)}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow
                  key={row.id}
                  row={row}
                  allColumns={allColumns}
                  visibleColumns={visibleColumns}
                />
              );
            })}
          </tbody>
        </Table>
        <Level className="is-mobile">
          <div />
          <Level.Side align="right">
            <AddAdmin />
          </Level.Side>
        </Level>
        <Loading loading={loading} />
      </>
    );
  }
  return <></>;
};

Members.Layout = AdminLayout;

export default Members;
