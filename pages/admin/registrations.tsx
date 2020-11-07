/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import { Row, CellProps } from "react-table";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Form, Level } from "react-bulma-components";
import toast from "utils/toast";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import ApproveCell from "components/admin/registrations/approveCell";
import EditCell from "components/admin/table/editCell";
import TableRow from "components/admin/table/tableRow";
import PaginationControl from "components/admin/table/paginationControl";
import useRegistrationTable, {
  RegistrationColumnInstance,
} from "utils/useRegistrationTable";
import AddRegistration from "components/admin/registrations/addRegistration";

export { getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Label, Control, Select } = Form;

const typeOptions = ["All", "New", "Renewal"];
const pageSizeOptions = [1, 2, 5, 10, 20, 50];
const getSortDirectionIndicatior = (
  column: RegistrationColumnInstance
): string => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return " 🔽";
    }
    return " 🔼";
  }
  return "";
};

const Registrations = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(registrationsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [registrationsData, setRegistrationsData] = useState<
    { registrations: Record<string, unknown>[] } | undefined
  >(undefined);

  const [resizeListener, sizes] = useResizeAware();

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
      },
      {
        Header: "SID",
        accessor: "sid",
      },
      {
        Header: "Chinese Name",
        accessor: "chineseName",
      },
      {
        Header: "English Name",
        accessor: "englishName",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Date of Birth",
        accessor: "dateOfBirth",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "College",
        accessor: (row: Record<string, unknown>) =>
          (row.college as College).code,
        id: "college",
      },
      {
        Header: "Major",
        accessor: (row: Record<string, unknown>) => (row.major as Major).code,
        id: "major",
      },
      {
        Header: "Date of Entry",
        accessor: "dateOfEntry",
      },
      {
        Header: "Expected Graduation",
        accessor: "expectedGraduationDate",
      },
      {
        Header: "Type",
        accessor: "registrationType",
        filter: typeFilter,
        disableSortBy: true,
      },
      {
        Header: "Action",
        accessor: () => "Registration",
        id: "approve",
        Cell: (cellPrpos: CellProps<Record<string, unknown>, string>) => (
          <div className="buttons">
            <ApproveCell {...cellPrpos} />
            <EditCell {...cellPrpos} />
          </div>
        ),
        disableSortBy: true,
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

  useEffect(() => {
    if (sizes.width < 640) {
      setHiddenColumns([
        "id",
        "chineseName",
        "gender",
        "dateOfBirth",
        "email",
        "phone",
        "dateOfEntry",
        "expectedGraduationDate",
      ]);
    } else if (sizes.width < 768) {
      setHiddenColumns([
        "id",
        "gender",
        "dateOfBirth",
        "email",
        "phone",
        "dateOfEntry",
        "expectedGraduationDate",
      ]);
    } else if (sizes.width < 1024) {
      setHiddenColumns([
        "id",
        "gender",
        "dateOfBirth",
        "email",
        "dateOfEntry",
        "expectedGraduationDate",
      ]);
    } else if (sizes.width < 1440) {
      setHiddenColumns([
        "gender",
        "dateOfBirth",
        "dateOfEntry",
        "expectedGraduationDate",
      ]);
    } else {
      setHiddenColumns([]);
    }
  }, [sizes.width, setHiddenColumns, visibleColumns]);

  if (data && data !== registrationsData) {
    setRegistrationsData(data);
  }

  if (!registrationsData) {
    if (loading) return <p>loading</p>;
    if (error) return <p>{error.message}</p>;
  } else if (error) {
    toast.danger(error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }

  if (user) {
    return (
      <>
        {resizeListener}
        <PaginationControl
          gotoPage={gotoPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
        <Level>
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
                  placeholder="Filter for keyword"
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
            <Field horizontal>
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
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>{getSortDirectionIndicatior(column)}</span>
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
        <Level>
          <div />
          <Level.Side align="right">
            <AddRegistration />
          </Level.Side>
        </Level>
      </>
    );
  }
  return <a href="/login">Please login first </a>;
};

Registrations.Layout = Layout;

export default Registrations;
