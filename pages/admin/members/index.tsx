import React, { useMemo, useState, useEffect, useCallback } from "react";
import useResizeAware from "react-resize-aware";
import Head from "next/head";
import { Row, CellProps } from "react-table";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Form, Level, Button } from "react-bulma-components";
import Papa from "papaparse";
import { DateTime } from "luxon";
import toast from "utils/toast";
import membersQuery from "apollo/queries/person/members.gql";
import PaginationControl from "components/admin/table/paginationControl";
import EditPersonCell from "components/admin/members/editPersonCell";
import TableRow from "components/admin/table/tableRow";
import TableHead from "components/admin/table/tableHead";
import useMemberTable from "utils/useMemberTable";
import Loading from "components/loading";
import useHideColumn from "utils/useHideColumn";
import { MemberStatusEnum, NON_MEMBER_STATUS } from "@/utils/Person";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Label, Control, Select } = Form;

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  // constant
  const statusOptions = useMemo(
    () =>
      Object.values(MemberStatusEnum as Record<string, string>)
        .filter((status) => status !== NON_MEMBER_STATUS.valueOf())
        .concat(["All"]),
    []
  );
  const pageSizeOptions = useMemo(() => [1, 2, 5, 10, 20, 50], []);

  // data
  const { data, loading, error } = useQuery(membersQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [membersData, setMembersData] = useState<
    { members: Record<string, unknown>[] } | undefined
  >(undefined);

  useEffect(() => setMembersData(data), [data]);
  useEffect(() => {
    if (error) {
      toast.danger(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [error]);

  // table
  const statusFilter = useCallback(
    (
      rows: Array<Row<Record<string, unknown>>>,
      id: string,
      filterValue: string
    ) =>
      filterValue === "All"
        ? rows
        : rows.filter((row) => row.values[id] === filterValue),
    []
  );

  const tableColumns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        id: "id",
        width: 75,
        maxWidth: 75,
      },
      {
        Header: "SID",
        accessor: "sid",
        id: "sid",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Chinese Name",
        accessor: "chineseName",
        id: "chineseName",
        width: 165,
        maxWidth: 165,
      },
      {
        Header: "English Name",
        accessor: "englishName",
        id: "englishName",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Gender",
        accessor: "gender",
        id: "gender",
        width: 105,
        maxWidth: 105,
      },
      {
        Header: "Date of Birth",
        accessor: "dateOfBirth",
        id: "dateOfBirth",
        width: 155,
        maxWidth: 155,
      },
      {
        Header: "Email",
        accessor: "email",
        id: "email",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Phone",
        accessor: "phone",
        id: "phone",
        width: 145,
        maxWidth: 145,
      },
      {
        Header: "College",
        accessor: (row: Record<string, unknown>) =>
          (row.college as College).code,
        id: "college",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Major",
        accessor: (row: Record<string, unknown>) => (row.major as Major).code,
        id: "major",
        width: 105,
        maxWidth: 105,
      },
      {
        Header: "Date of Entry",
        accessor: "dateOfEntry",
        id: "dateOfEntry",
        width: 165,
        maxWidth: 165,
      },
      {
        Header: "Expected Graduation",
        accessor: "expectedGraduationDate",
        id: "expectedGraduationDate",
        width: 215,
        maxWidth: 215,
      },
      {
        Header: "Member Since",
        accessor: "memberSince",
        id: "memberSince",
        width: 165,
        maxWidth: 165,
      },
      {
        Header: "Member Until",
        accessor: "memberUntil",
        id: "memberUntil",
        width: 165,
        maxWidth: 165,
      },
      {
        Header: "Status",
        accessor: "status",
        id: "status",
        filter: statusFilter,
        disableSortBy: true,
        width: 100,
        maxWidth: 100,
      },
      {
        Header: "Action",
        accessor: () => "Member",
        id: "action",
        Cell: (cellProps: CellProps<Record<string, unknown>, string>) => (
          <EditPersonCell {...cellProps} />
        ),
        disableSortBy: true,
        minWidth: 85,
        width: 85,
        maxWidth: 85,
      },
    ],
    [statusFilter]
  );

  const tableData = useMemo(() => {
    return membersData?.members ?? [];
  }, [membersData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => (row.id as number).toString();
  }, []);

  const initialFilters = useMemo(
    () => [
      {
        id: "status",
        value: "Activated",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { globalFilter, filters, pageIndex, pageSize },
    setGlobalFilter,
    setFilter,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    page,
    pageCount,
    setPageSize,
    gotoPage,
    rows,
  } = useMemberTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    initialState: { filters: initialFilters, pageSize: 10, pageIndex: 0 },
  });

  const [globalFilterInput, setGlobalFilterInput] = useState(globalFilter);

  const [statusFilterInput, setStatusFilterInput] = useState(
    filters.find(({ id }) => id === "status")?.value
  );

  const onGlobalFilterChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 500);

  const onStatusFilterChange = useAsyncDebounce((value) => {
    setFilter("status", value || undefined);
  }, 500);

  // export files
  const [isFileProcessing, setIsFileProcessing] = useState(false);

  const onExport = useCallback((exportData: Record<string, unknown>[]) => {
    if (exportData.length) {
      setIsFileProcessing(true);
      const memberExport = exportData.map(
        ({
          id,
          sid,
          chineseName,
          englishName,
          gender,
          dateOfBirth,
          email,
          phone,
          college,
          major,
          dateOfEntry,
          expectedGraduationDate,
          memberSince,
        }) => ({
          ID: id,
          SID: sid,
          "Chinese Name": chineseName,
          "English Name": englishName,
          Gender: gender,
          "Date of Birth": dateOfBirth,
          Email: email,
          Phone: phone,
          College: (college as College).code,
          Major: (major as Major).code,
          "Date of Entry": dateOfEntry,
          "Expected Graduation Date": expectedGraduationDate,
          "Member Since": memberSince,
        })
      );
      const csv = Papa.unparse(memberExport, {
        quotes: [
          false,
          false,
          true,
          true,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
        ],
      });
      const element = document.createElement("a");
      const file = new Blob([csv], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      const time = DateTime.local();
      element.download = `members-${time.toISO()}.csv`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
      setIsFileProcessing(false);
    } else {
      toast.danger("No member data.", {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsFileProcessing(false);
    }
  }, []);

  const onExportAll = useCallback(() => {
    if (membersData?.members.length) {
      onExport(membersData.members);
    } else {
      toast.danger("No member data.", {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsFileProcessing(false);
    }
  }, [membersData, onExport]);

  const onExportFiltered = useCallback(() => {
    if (rows.length) {
      onExport(rows.map((r) => r.original));
    } else {
      toast.danger("No member data.", {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsFileProcessing(false);
    }
  }, [rows, onExport]);

  // resize
  const [resizeListener, sizes] = useResizeAware();

  const hideColumnOrder = useMemo(
    () => [
      ["dateOfBirth"],
      ["gender"],
      ["email", "phone"],
      ["dateOfEntry", "expectedGraduationDate"],
      ["memberSince", "memberUntil"],
      ["chineseName"],
      ["major", "college"],
      ["status"],
      ["englishName"],
      ["id"],
    ],
    []
  );

  useHideColumn(sizes.width, hideColumnOrder, tableColumns, setHiddenColumns);

  if (user) {
    return (
      <>
        <Head>
          <title>Member List</title>
        </Head>
        {resizeListener}
        <Button.Group position="right">
          <Button onClick={onExportAll} loading={isFileProcessing}>
            Export All
          </Button>
          <Button
            color="primary"
            onClick={onExportFiltered}
            loading={isFileProcessing}
          >
            Export Filtered
          </Button>
        </Button.Group>
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
                    setStatusFilterInput(event.target.value);
                    onStatusFilterChange(event.target.value);
                  }}
                  value={statusFilterInput}
                >
                  {statusOptions.map((statusOption) => (
                    <option key={statusOption}>{statusOption}</option>
                  ))}
                </Select>
              </Control>
              <Control fullwidth>
                <Input
                  placeholder="Filter by keyword"
                  value={globalFilterInput}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => {
                    setGlobalFilterInput(event.target.value);
                    onGlobalFilterChange(event.target.value);
                  }}
                />
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
            tableSortable
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
        <div style={{ textAlign: "right" }}>
          Showing {page.length} of {tableData.length} results
        </div>
        <PaginationControl
          gotoPage={gotoPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
        <Loading loading={loading} />
      </>
    );
  }
  return <></>;
};

Members.Layout = AdminLayout;

export default Members;
