import React, { useMemo, useState, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import { Row, CellProps } from "react-table";
import Head from "next/head";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Form, Level } from "react-bulma-components";
import toast from "utils/toast";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import ApproveCell from "components/admin/registrations/approveCell";
import EditPersonCell from "components/admin/members/editPersonCell";
import TableRow from "components/admin/table/tableRow";
import TableHead from "components/admin/table/tableHead";
import PaginationControl from "components/admin/table/paginationControl";
import useRegistrationTable from "utils/useRegistrationTable";
import AddRegistration from "components/admin/registrations/addRegistration";
import Loading from "components/loading";
import useHideColumn from "utils/useHideColumn";
import { RegistrationTypeEnum } from "@/utils/Person";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Label, Control, Select } = Form;

const Registrations = ({ user }: ServerSideProps): React.ReactElement => {
  // constant
  const typeOptions = useMemo(
    () =>
      Object.values(RegistrationTypeEnum as Record<string, string>).concat([
        "All",
      ]),
    []
  );
  const pageSizeOptions = useMemo(() => [1, 2, 5, 10, 20, 50], []);

  // data
  const { data, loading, error } = useQuery(registrationsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [registrationsData, setRegistrationsData] = useState<
    { registrations: Record<string, unknown>[] } | undefined
  >(undefined);

  useEffect(() => setRegistrationsData(data), [data]);

  useEffect(() => {
    if (error) {
      toast.danger(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [error]);

  // table
  const typeFilter = useMemo(
    () => (
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
        Header: "Type",
        accessor: "registrationType",
        id: "registrationType",
        filter: typeFilter,
        disableSortBy: true,
        width: 60,
        maxWidth: 60,
      },
      {
        Header: "Action",
        accessor: () => "Registration",
        id: "action",
        Cell: (cellPrpos: CellProps<Record<string, unknown>, string>) => (
          <div className="buttons">
            <ApproveCell {...cellPrpos} />
            <EditPersonCell {...cellPrpos} />
          </div>
        ),
        disableSortBy: true,
        minWidth: 200,
        width: 200,
        maxWidth: 200,
      },
    ],
    [typeFilter]
  );

  const tableData = useMemo(() => {
    return registrationsData?.registrations ?? [];
  }, [registrationsData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => (row.id as number).toString();
  }, []);

  const initialFilters = useMemo(
    () => [
      {
        id: "registrationType",
        value: "All",
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
    setFilter,
    setGlobalFilter,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    page,
    pageCount,
    setPageSize,
    gotoPage,
  } = useRegistrationTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    autoResetPage: false,
    initialState: { filters: initialFilters, pageSize: 10, pageIndex: 0 },
  });

  const [globalFilterInput, setGlobalFilterInput] = useState(globalFilter);

  const [typeFilterInput, setTypeFilterInput] = useState(
    filters.find(({ id }) => id === "registrationType")?.value
  );

  const onGlobalFilterChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 500);

  const onTypeFilterChange = useAsyncDebounce((value) => {
    setFilter("registrationType", value || undefined);
  }, 500);

  // resize
  const [resizeListener, sizes] = useResizeAware();

  const hideColumnOrder = useMemo(
    () => [
      ["dateOfBirth"],
      ["gender"],
      ["email", "phone"],
      ["dateOfEntry", "expectedGraduationDate"],
      ["chineseName"],
      ["major", "college"],
      ["registrationType"],
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
          <title>Registration List</title>
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
                    setTypeFilterInput(event.target.value);
                    onTypeFilterChange(event.target.value);
                  }}
                  value={typeFilterInput}
                >
                  {typeOptions.map((typeOption) => (
                    <option key={typeOption}>{typeOption}</option>
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
        <Level className="is-mobile">
          <div />
          <Level.Side align="right">
            <AddRegistration />
          </Level.Side>
        </Level>
        <Loading loading={loading} />
      </>
    );
  }
  return <></>;
};

Registrations.Layout = AdminLayout;

export default Registrations;
