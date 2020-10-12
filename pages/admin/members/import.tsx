/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import Papa from "papaparse";
import _ from "lodash";
import { useTable, CellProps } from "react-table";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import {
  Level,
  Table,
  Button,
  Section,
  Container,
  Form,
} from "react-bulma-components";
import toast from "utils/toast";
import membersQuery from "apollo/queries/person/members.gql";
import importPeopleMutation from "apollo/queries/person/importPeople.gql";

export { getServerSideProps } from "utils/getServerSideProps";

const { InputFile } = Form;

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  /* const { data, loading, error } = useQuery(membersQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  }); */
  const [
    importPeople,
    { loading: importPeopleMutationLoading, error: importPeopleMutationError },
  ] = useMutation(importPeopleMutation);

  const [membersData, setMembersData] = useState<
    { members: Record<string, unknown>[] } | undefined
  >(undefined);
  const [importFile, setImportFile] = useState<File>();

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
        /* Cell: ({ value }: CellProps<Record<string, unknown>, College>) => {
          return <div>{`${value.code}`}</div>;
        }, */
      },
      {
        Header: "Major",
        accessor: "major",
        /* Cell: ({ value }: CellProps<Record<string, unknown>, Major>) => {
          return <div>{`${value.code}`}</div>;
        }, */
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
        Header: "Member Since",
        accessor: "memberSince",
      },
    ],
    []
  );

  const tableData = useMemo(() => {
    return membersData?.members ?? [];
  }, [membersData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => (row.id as number).toString();
  }, []);

  const tableInstance = useTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
  });

  const upload = () => {
    importPeople({
      variables: {
        people: membersData?.members.map((member) => _.omit(member, "id")),
      },
    });
  };

  /* if (data && data !== membersData) {
    console.log("Original: ", data);
    setMembersData(data);
  } */

  /* if (!membersData) {
    if (loading) return <p>loading</p>;
    if (error) return <p>{error.message}</p>;
  } else if (error) {
    toast.danger(error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  } */

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const papaConfig = { header: true, skipEmptyLines: true };

  if (user) {
    return (
      <>
        <Level>
          <Level.Side align="left">
            <Level.Item>
              <InputFile
                color="primary"
                placeholder="Textarea"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files && event.target.files[0]) {
                    setImportFile(event.target.files[0]);
                    console.log(event.target.files[0]);
                    Papa.parse(event.target.files[0], {
                      ...papaConfig,
                      complete(results) {
                        console.log("Finished:", results.data);
                        const result = {
                          members: results.data.map(
                            ({
                              ID: id,
                              SID: sid,
                              "Chinese Name": chineseName,
                              "English Name": englishName,
                              Gender: gender,
                              "Date of Birth": dateOfBirth,
                              Email: email,
                              Phone: phone,
                              College: college,
                              Major: major,
                              "Date of Entry": dateOfEntry,
                              "Expected Graduation Date": expectedGraduationDate,
                              "Member Since": memberSince,
                            }) => ({
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
                            })
                          ),
                        };
                        console.log("Mapped:", result);
                        if (result && result !== membersData) {
                          setMembersData(result);
                        }
                      },
                    });
                  } else {
                    setImportFile(undefined);
                    console.log("No files");
                  }
                }}
              />
            </Level.Item>
          </Level.Side>
          <Level.Side align="right">
            <Level.Item>
              <Button color="primary" onClick={upload}>
                Upload
              </Button>
            </Level.Item>
          </Level.Side>
        </Level>
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
