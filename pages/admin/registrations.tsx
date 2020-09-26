/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo } from "react";
import { useTable, CellProps } from "react-table";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { PersonAttributes } from "@/models/Person";

export { getServerSideProps } from "utils/getServerSideProps";

const Index: React.FunctionComponent<ServerSideProps> = ({
  user,
}: ServerSideProps) => {
  const { data, loading, error } = useQuery(registrationsQuery);
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
        accessor: "college",
        Cell: ({ value }: CellProps<Record<string, unknown>, College>) => {
          return <div>{`${value.code}`}</div>;
        },
      },
      {
        Header: "Major",
        accessor: "major",
        Cell: ({ value }: CellProps<Record<string, unknown>, Major>) => {
          return <div>{`${value.code}`}</div>;
        },
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
        Header: "Approve",
        accessor: (row: Record<string, unknown>) => row.id,
        id: "approve",
        Cell: ({ row, value }: CellProps<Record<string, unknown>, number>) => {
          return (
            <div>{`A button to approve ${row.values.englishName} (${value})`}</div>
          );
        },
      },
    ],
    []
  );
  const tableData = useMemo(() => {
    return data?.registrations ?? [];
  }, [data]);
  const tableInstance = useTable({ columns: tableColumns, data: tableData });

  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  if (user) {
    return (
      <div>
        <div>Hi, {user.name}</div>
        {/* apply the table props */}
        <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      borderBottom: "solid 3px red",
                      background: "aliceblue",
                      color: "black",
                      fontWeight: "bold",
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: "10px",
                          border: "solid 1px gray",
                          background: "papayawhip",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
};

((Index as unknown) as { Layout: React.ComponentType }).Layout = Layout;

export default Index;
