/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState, useCallback } from "react";
import Papa from "papaparse";
import _ from "lodash";
import { DateTime } from "luxon";
import { useTable } from "react-table";
import { useMutation } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import toast from "utils/toast";
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
      },
      {
        Header: "Major",
        accessor: "major",
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
  const [isUploading, setIsUploading] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const upload = () => {
    // remove member id to prevent data collision
    if (!membersData || membersData === undefined) {
      toast.danger("No member data found", {
        position: toast.POSITION.TOP_LEFT,
      });
      return;
    }
    const members = membersData.members.map((member) => {
      const result = _.omit(member, "id");
      const { memberSince } = result;
      result.memberSince = memberSince ?? DateTime.local().toISODate();
      return result;
    });
    setIsUploading(true);
    _.chunk(members, 100).forEach((people, batch) =>
      importPeople({
        variables: {
          people,
        },
      })
        .then(({ data }) => {
          data.importPeople.forEach(
            (
              { success, message }: { success: boolean; message: string },
              count: number
            ) => {
              if (!success) {
                toast.danger(
                  `Error on ${members[batch * 100 + count].sid}: ${message}`,
                  {
                    position: toast.POSITION.TOP_LEFT,
                  }
                );
              }
            }
          );
        })
        .catch((err) => {
          toast.danger(err.message, {
            position: toast.POSITION.TOP_LEFT,
          });
          setIsUploading(false);
        })
        .finally(() => setIsUploading(false))
    );
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const onImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setIsFileProcessing(true);
        Papa.parse(event.target.files[0], {
          header: true,
          skipEmptyLines: true,
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
            setIsFileProcessing(false);
          },
        });
      } else {
        toast.danger("No files were selected.", {
          position: toast.POSITION.TOP_LEFT,
        });
        setIsFileProcessing(false);
      }
    },
    [membersData]
  );

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
                <Button color="primary" onClick={upload} loading={isUploading}>
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
