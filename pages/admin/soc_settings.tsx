import React, { useMemo, useState, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import { useTable, CellProps } from "react-table";
import { useQuery } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { Table } from "react-bulma-components";
import EditCell from "components/admin/socSettings/editCell";
import TableRow from "components/admin/table/tableRow";

import toast from "utils/toast";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";
import allSocSettings from "utils/socSettings";
import { cloneDeep, compact } from "lodash";
import Loading from "components/loading";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const SocSettings = ({ user }: ServerSideProps): React.ReactElement => {
  // constant
  const alwaysHiddenColumns = useMemo(() => ["desc", "type"], []);

  // resize
  const [resizeListener, sizes] = useResizeAware();

  // data
  const { data, loading, error } = useQuery(socSettingsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [socSettingsData, setSocSettingsData] = useState<
    { socSettings: Record<string, string>[] } | undefined
  >(undefined);

  useEffect(() => setSocSettingsData(data), [data]);
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
        Header: "Key",
        accessor: "key",
        id: "key",
        Cell: ({ row, value }: CellProps<Record<string, unknown>, string>) => {
          return (
            <div>
              <p>{value}</p>
              <p>
                <i>{row.values.desc}</i>
              </p>
            </div>
          );
        },
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Description",
        accessor: "desc",
        width: 0,
        maxWidth: 0,
      },
      {
        Header: "Type",
        accessor: "type",
        width: 0,
        maxWidth: 0,
      },
      {
        Header: "Value",
        accessor: "value",
        id: "value",
        Cell: (props: CellProps<Record<string, unknown>, string>) => (
          <EditCell {...props} windowWidth={sizes.width} />
        ),
        minWidth: 300,
        width: 0.7 * sizes.width,
        maxWidth: 10000,
      },
    ],
    [sizes.width]
  );

  const tableData = useMemo(
    () =>
      socSettingsData
        ? Object.values(allSocSettings).map((item1) => ({
            ...socSettingsData.socSettings.find(
              (item2) => item1.key && item2.key && item1.key === item2.key
            ),
            ...item1,
          }))
        : [],
    [socSettingsData]
  );

  const tableInstance = useTable({
    columns: tableColumns,
    data: tableData,
    initialState: {
      hiddenColumns: alwaysHiddenColumns,
    },
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

  // resizeListener
  const hideColumnOrder = useMemo(() => [["value"]], []);

  useEffect(() => {
    let newHideColumn: string[] = alwaysHiddenColumns;
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
  }, [
    alwaysHiddenColumns,
    sizes.width,
    hideColumnOrder,
    tableColumns,
    setHiddenColumns,
  ]);

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
                    {...column.getHeaderProps()}
                    style={{
                      width: column.width,
                      maxWidth: column.maxWidth,
                      minWidth: column.minWidth,
                    }}
                  >
                    {column.render("Header")}
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
                  allColumns={allColumns.filter(
                    (column) => !alwaysHiddenColumns.includes(column.id)
                  )}
                  visibleColumns={visibleColumns}
                />
              );
            })}
          </tbody>
        </Table>
        <Loading loading={loading} />
      </>
    );
  }
  return <></>;
};

SocSettings.Layout = AdminLayout;

export default SocSettings;
