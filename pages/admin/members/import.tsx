/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Row } from "react-table";
import { statusOf, PersonModelAttributes } from "@/utils/Person";
import useAsyncDebounce from "utils/useAsyncDebounce";
import PaginationControl from "components/admin/table/paginationControl";
import Papa from "papaparse";
import _ from "lodash";
import { DateTime } from "luxon";
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
import useMemberTable, { MemberColumnInstance } from "utils/useMemberTable";
import ImportCell from "components/admin/table/importCell";
import ImportEditCell from "components/admin/table/importEditCell";

export { getServerSideProps } from "utils/getServerSideProps";

const { InputFile, Input, Field, Label, Control, Select } = Form;

const statusOptions = ["All", "Activated", "Expired"];
const pageSizeOptions = [1, 2, 5, 10, 20, 50];
const getSortDirectionIndicatior = (column: MemberColumnInstance): string => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return " 🔽";
    }
    return " 🔼";
  }
  return "";
};

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  const [
    importPeople,
    { loading: importPeopleMutationLoading, error: importPeopleMutationError },
  ] = useMutation(importPeopleMutation);

  const [membersData, setMembersData] = useState<
    { members: Record<string, unknown>[] } | undefined
  >(undefined);
  const [skipPageReset, setSkipPageReset] = useState(false);

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
        Cell: ImportCell,
      },
      {
        Header: "Chinese Name",
        accessor: "chineseName",
        Cell: ImportCell,
      },
      {
        Header: "English Name",
        accessor: "englishName",
        Cell: ImportCell,
      },
      {
        Header: "Gender",
        accessor: "gender",
        Cell: ImportCell,
      },
      {
        Header: "Date of Birth",
        accessor: "dateOfBirth",
        Cell: ImportCell,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ImportCell,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Cell: ImportCell,
      },
      {
        Header: "College",
        accessor: "college",
        Cell: ImportCell,
      },
      {
        Header: "Major",
        accessor: "major",
        Cell: ImportCell,
      },
      {
        Header: "Date of Entry",
        accessor: "dateOfEntry",
        Cell: ImportCell,
      },
      {
        Header: "Expected Graduation Date",
        accessor: "expectedGraduationDate",
        Cell: ImportCell,
      },
      {
        Header: "Member Since",
        accessor: "memberSince",
        Cell: ImportCell,
      },
      {
        Header: "Status",
        accessor: (row: Record<string, unknown>) =>
          statusOf(row as PersonModelAttributes),
        filter: statusFilter,
        disableSortBy: true,
      },
      {
        Header: "Action",
        accessor: () => "Member",
        id: "edit",
        Cell: ImportEditCell,
        disableSortBy: true,
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

  const dataUpdate = (rowIndex: number, diff: Record<string, unknown>) => {
    setSkipPageReset(true);
    setMembersData((old: { members: Record<string, unknown>[] }) => {
      return _.set({ ...old }, ["members", rowIndex], {
        ..._.get(old, ["members", rowIndex]),
        ...diff,
      });
    });
  };

  const tableInstance = useMemberTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    initialState: { filters: initialFilters, pageSize: 10, pageIndex: 0 },
    autoResetPage: !skipPageReset,
    dataUpdate,
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
        })
        .finally(() => setIsUploading(false))
    );
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [membersData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { globalFilter, filters, pageIndex, pageSize },
    setGlobalFilter,
    setFilter,
    page,
    pageCount,
    setPageSize,
    gotoPage,
  } = tableInstance;

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
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
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
          <PaginationControl
            gotoPage={gotoPage}
            pageIndex={pageIndex}
            pageCount={pageCount}
          />
        </Container>
      </Section>
    );
  }
  return <a href="/login">Please login first </a>;
};

Members.Layout = Layout;

export default Members;
