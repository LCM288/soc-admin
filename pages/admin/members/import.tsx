/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import Papa from "papaparse";
import _ from "lodash";
import { DateTime } from "luxon";
import { useTable } from "react-table";
import { useMutation } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import {
  Level,
  Table,
  Button,
  Section,
  Container,
  Form,
} from "react-bulma-components";
import importPeopleMutation from "apollo/queries/person/importPeople.gql";

export { getServerSideProps } from "utils/getServerSideProps";

const { InputFile } = Form;

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  const [
    importPeople,
    { loading: importPeopleMutationLoading, error: importPeopleMutationError },
  ] = useMutation(importPeopleMutation);

  const [membersData, setMembersData] = useState<
    { members: Record<string, unknown>[] } | undefined
  >(undefined);

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
    // remove member id to prevent data collision
    const members = membersData?.members.map((member) => {
      const result = _.omit(member, "id");
      const { memberSince } = result;
      result.memberSince = memberSince || DateTime.local().toISODate();
      return result;
    });
    _.chunk(members, 100).forEach((people) =>
      importPeople({
        variables: {
          people,
        },
      })
    );
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const papaConfig = { header: true, skipEmptyLines: true };

  const onImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      Papa.parse(event.target.files[0], {
        ...papaConfig,
        complete(results) {
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
          if (result && result !== membersData) {
            setMembersData(result);
          }
        },
      });
    }
  };

  if (user) {
    return (
      <Section>
        <Container fluid>
          <Level>
            <Level.Side align="left">
              <Level.Item>
                <InputFile
                  color="primary"
                  placeholder="Textarea"
                  inputProps={{ accept: ".csv,.tsv,.txt" }}
                  onChange={onImport}
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
        </Container>
      </Section>
    );
  }
  return <a href="/login">Please login first </a>;
};

Members.Layout = Layout;

export default Members;
