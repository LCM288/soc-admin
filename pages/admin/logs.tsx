import React, { useMemo, useState, useCallback, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import useLogTable from "utils/useLogTable";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { Table, Form, Level } from "react-bulma-components";
import toast from "utils/toast";
import logEntriesQuery from "apollo/queries/log/logEntries.gql";
import PaginationControl from "components/admin/table/paginationControl";
import TableRow from "components/admin/table/tableRow";
import Loading from "components/loading";
import useHideColumn from "utils/useHideColumn";
import tables from "@/json/tables.json";
import { useLazyQuery } from "@apollo/react-hooks";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const { Field, Label, Control, Select } = Form;

const Logs = ({ user }: ServerSideProps): React.ReactElement => {
  // constants
  const tableOptions = useMemo(() => Object.keys(tables).concat(["All"]), []);
  const pageSizeOptions = useMemo(() => [1, 2, 5, 10, 20, 50], []);
  const initialPageSize = useMemo(() => 10, []);

  // data
  const [tableFilter, setTableFilter] = useState("All");

  const [
    getLogEntries,
    { loading: logEntriesLoading, data: logEntriesData, error },
  ] = useLazyQuery(logEntriesQuery);

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
        Header: "id",
        accessor: "id",
        id: "id",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "updatedAt",
        accessor: "updatedAt",
        id: "updatedAt",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "who",
        accessor: "who",
        id: "who",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "table",
        accessor: "table",
        id: "table",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "description",
        accessor: "description",
        id: "description",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "oldValue",
        accessor: "oldValue",
        id: "oldValue",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "newValue",
        accessor: "newValue",
        id: "newValue",
        width: 300,
        maxWidth: 300,
      },
    ],
    []
  );

  const tableData = useMemo(() => {
    return logEntriesData?.logEntries.entries ?? [];
  }, [logEntriesData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => row.id as string;
  }, []);

  const pageCount = useMemo(
    () =>
      Math.ceil(
        (logEntriesData?.logEntries.count ?? 0) /
          (logEntriesData?.logEntries.entries.length || 1)
      ),
    [logEntriesData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { pageIndex, pageSize },
    setHiddenColumns,
    allColumns,
    visibleColumns,
    page,
    setPageSize,
    gotoPage,
  } = useLogTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
    initialState: { pageSize: initialPageSize, pageIndex: 0 },
    manualPagination: true,
    pageCount,
  });

  // resize
  const [resizeListener, sizes] = useResizeAware();

  const hideColumnOrder = useMemo(
    () => [["oldValue", "newValue"], ["description"]],
    []
  );

  useHideColumn(sizes.width, hideColumnOrder, tableColumns, setHiddenColumns);

  // refetch data

  useEffect(() => {
    getLogEntries({
      variables: {
        limit: pageSize,
        offset: pageSize * pageIndex,
        table: tableFilter === "All" ? undefined : tableFilter,
      },
    });
  }, [getLogEntries, pageSize, pageIndex, tableFilter]);

  if (user) {
    return (
      <>
        {resizeListener}
        <PaginationControl
          gotoPage={gotoPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
        <Level className="is-mobile is-flex-wrap-wrap">
          <Level.Side align="left">
            <Field kind="addons">
              <Control>
                <Select
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => {
                    setTableFilter(event.target.value);
                  }}
                  value={tableFilter}
                >
                  {tableOptions.map((tableOption) => (
                    <option key={tableOption}>{tableOption}</option>
                  ))}
                </Select>
              </Control>
            </Field>
          </Level.Side>
          <Level.Side align="right">
            <Field horizontal className="is-flex">
              <Label className="mr-2" style={{ alignSelf: "center" }}>
                Result per page
              </Label>
              <Control>
                <Select
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => {
                    setPageSize(parseInt(event.target.value, 10));
                  }}
                  value={pageSize.toString()}
                >
                  {pageSizeOptions.map((pageSizeOption) => (
                    <option key={pageSizeOption}>{pageSizeOption}</option>
                  ))}
                </Select>
              </Control>
            </Field>
          </Level.Side>
        </Level>
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
            {page.map((row) => {
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
        <PaginationControl
          gotoPage={gotoPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
        <Loading loading={logEntriesLoading} />
      </>
    );
  }
  return <></>;
};

Logs.Layout = AdminLayout;

export default Logs;
