/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import { useGlobalFilter, useFilters, Row } from "react-table";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Form } from "react-bulma-components";
import toast from "utils/toast";
import membersQuery from "apollo/queries/person/members.gql";
import { useMemberTable } from "utils/reactTableTypeFix";

export { getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Control, Select } = Form;

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(membersQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [membersData, setMembersData] = useState<
    { members: Record<string, unknown>[] } | undefined
  >(undefined);

  const statusFilter = useMemo(
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
        Header: "Status",
        accessor: "status",
        filter: statusFilter,
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

  const tableInstance = useMemberTable(
    {
      columns: tableColumns,
      data: tableData,
      getRowId: tableGetRowId,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      initialState: { filters: initialFilters },
    },
    useFilters,
    useGlobalFilter
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    setFilter,
  } = tableInstance;

  const [globalFilterInput, setGlobalFilterInput] = useState(
    state.globalFilter
  );

  const [statusFilterInput, setStatusFilterInput] = useState(
    state.filters.find(({ id }) => id === "status")?.value
  );

  const onGlobalFilterChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 500);

  const onStatusFilterChange = useAsyncDebounce((value) => {
    setFilter("status", value || undefined);
  }, 500);

  if (data && data !== membersData) {
    setMembersData(data);
  }

  if (!membersData) {
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
        <Field kind="addons">
          <Control>
            <Select
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                setStatusFilterInput(event.target.value);
                onStatusFilterChange(event.target.value);
              }}
              value={statusFilterInput}
            >
              <option>All</option>
              <option>Activated</option>
              <option>Expired</option>
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
            {rows.map((row) => {
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
      </>
    );
  }
  return <a href="/login">Please login first </a>;
};

Members.Layout = Layout;

export default Members;
