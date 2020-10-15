/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import { useGlobalFilter, useFilters, usePagination, Row } from "react-table";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Form, Button, Level } from "react-bulma-components";
import toast from "utils/toast";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import ApproveCell from "components/admin/registrations/approveCell";
import { useRegistrationTable } from "utils/reactTableTypeFix";
import getPageIndices from "utils/getPageIndices";

export { getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Label, Control, Select } = Form;

const Registrations = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(registrationsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [registrationsData, setRegistrationsData] = useState<
    { registrations: Record<string, unknown>[] } | undefined
  >(undefined);

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
        Header: "Expected Graduation Date",
        accessor: "expectedGraduationDate",
      },
      {
        Header: "Type of registration",
        accessor: "registrationType",
        filter: typeFilter,
      },
      {
        Header: "Approve",
        accessor: (row: Record<string, unknown>) => row.sid,
        id: "approve",
        Cell: ApproveCell,
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

  const tableInstance = useRegistrationTable(
    {
      columns: tableColumns,
      data: tableData,
      getRowId: tableGetRowId,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      autoResetPage: false,
      initialState: { filters: initialFilters, pageSize: 10, pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { globalFilter, filters, pageIndex, pageSize },
    setFilter,
    setGlobalFilter,
    page,
    pageCount,
    setPageSize,
    gotoPage,
  } = tableInstance;

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
    const pageIndices = getPageIndices(pageIndex, pageCount);
    return (
      <>
        <Field kind="addons">
          <Control>
            <Select
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                setTypeFilterInput(event.target.value);
                onTypeFilterChange(event.target.value);
              }}
              value={typeFilterInput}
            >
              <option>All</option>
              <option>New</option>
              <option>Renewal</option>
            </Select>
          </Control>
          <Control fullwidth>
            <Input
              placeholder="Filter for keyword"
              value={globalFilterInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                setGlobalFilterInput(event.target.value);
                onGlobalFilterChange(event.target.value);
              }}
            />
          </Control>
        </Field>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Level>
          <Level.Item>
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
                  <option>1</option>
                  <option>2</option>
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </Select>
              </Control>
            </Field>
          </Level.Item>
        </Level>
        <Level>
          <Level.Item>
            <Field kind="addons">
              {pageIndices.map((p) => (
                <Control>
                  <Button
                    key={p}
                    onClick={() => gotoPage(p)}
                    className={{ "is-info": pageIndex === p }}
                  >
                    {p + 1}
                  </Button>
                </Control>
              ))}
            </Field>
          </Level.Item>
        </Level>
      </>
    );
  }
  return <a href="/login">Please login first </a>;
};

Registrations.Layout = Layout;

export default Registrations;
