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
import Loading from "components/loading";
import useHideColumn from "utils/useHideColumn";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Admins = ({ user }: ServerSideProps): React.ReactElement => {
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
        id: "sid",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Nickname",
        accessor: "nickname",
        id: "nickname",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Position",
        accessor: "pos",
        id: "pos",
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

  const hideColumnOrder = useMemo(() => [["pos"], ["nickname"]], []);

  useHideColumn(sizes.width, hideColumnOrder, tableColumns, setHiddenColumns);

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
                    className={
                      tableColumns.find(
                        (tableColumn) => tableColumn.id === column.id
                      )?.disableSortBy
                        ? ""
                        : "is-clickable"
                    }
                  >
                    {column.render("Header")}
                    <span>{getSortDirectionIndicatior(column)}</span>
                  </th>
                ))}
                <td style={{ width: "1px", maxWidth: "1px", padding: 0 }} />
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

Admins.Layout = AdminLayout;

export default Admins;
