import React, { useMemo, useState, useCallback, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import Head from "next/head";
import useLogTable from "utils/useLogTable";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { Table, Form, Level } from "react-bulma-components";
import toast from "utils/toast";
import logEntriesQuery from "apollo/queries/log/logEntries.gql";
import PaginationControl from "components/admin/table/paginationControl";
import TableRow from "components/admin/table/tableRow";
import TableHead from "components/admin/table/tableHead";
import Loading from "components/loading";
import useHideColumn from "utils/useHideColumn";
import tables from "@/json/tables.json";
import { DateTime } from "luxon";
import { useLazyQuery } from "@apollo/react-hooks";
import DetailsCell from "components/admin/logs/detailsCell";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const { Field, Label, Control, Select } = Form;

const Logs = ({ user }: ServerSideProps): React.ReactElement => {
  // constants
  const tableOptions = useMemo(() => Object.keys(tables).concat(["All"]), []);
  const pageSizeOptions = useMemo(() => [1, 2, 5, 10, 20, 50], []);
  const initialPageSize = useMemo(() => 10, []);

  // data
  const [
    getLogEntries,
    { loading: logEntriesLoading, data: logEntriesData, error },
  ] = useLazyQuery(logEntriesQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

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
        Header: "Date",
        accessor: (row: Record<string, unknown>) =>
          DateTime.fromISO(row.updatedAt as string).toISODate(),
        id: "date",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Time",
        accessor: (row: Record<string, unknown>) =>
          DateTime.fromISO(row.updatedAt as string).toLocaleString(
            DateTime.TIME_24_WITH_SECONDS
          ),
        id: "time",
        width: 85,
        maxWidth: 85,
      },
      {
        Header: "Description",
        accessor: "description",
        id: "description",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Who?",
        accessor: (row: Record<string, unknown>) => `by ${row.who}`,
        id: "who",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Details",
        id: "details",
        Cell: DetailsCell,
        width: 100000,
        maxWidth: 100000,
      },
    ],
    []
  );

  const tableData = useMemo(() => logEntriesData?.logEntries.entries ?? [], [
    logEntriesData,
  ]);

  const tableGetRowId = useCallback(
    (row: Record<string, unknown>) => row.id as string,
    []
  );

  const [pageCount, setPageCount] = useState(1);

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
    () => [["details"], ["description", "who"]],
    []
  );

  useHideColumn(sizes.width, hideColumnOrder, tableColumns, setHiddenColumns);

  // refetch data
  const [tableFilter, setTableFilter] = useState("All");

  useEffect(() => {
    setPageCount(
      Math.ceil((logEntriesData?.logEntries.count ?? 0) / (pageSize || 1))
    );
  }, [logEntriesData, pageSize]);

  useEffect(() => {
    gotoPage(0);
  }, [tableFilter, gotoPage]);

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
        <Head>
          <title>Check Logs</title>
        </Head>
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
          <TableHead
            headerGroups={headerGroups}
            tableColumns={tableColumns}
            tableSortable={false}
          />
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
        <Level className="is-mobile is-flex-wrap-wrap">
          <Level.Side align="left" className="is-flex-shrink-1">
            <Level.Item className="is-flex-shrink-1">
              <span>
                All time shown is in{" "}
                <i>
                  {`${DateTime.local().offsetNameLong} (${
                    DateTime.local().offsetNameShort
                  })`}
                </i>
              </span>
            </Level.Item>
          </Level.Side>
          <Level.Side align="right" style={{ marginLeft: "auto" }}>
            <Level.Item>
              Showing {page.length} of {logEntriesData?.logEntries.count ?? 0}{" "}
              results
            </Level.Item>
          </Level.Side>
        </Level>
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
