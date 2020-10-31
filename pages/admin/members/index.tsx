/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState, useCallback, useRef } from "react";
import { Row } from "react-table";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Person } from "@/models/Person";
import { Table, Form, Level, Button } from "react-bulma-components";
import Papa from "papaparse";
import { DateTime } from "luxon";
import toast from "utils/toast";
import membersQuery from "apollo/queries/person/members.gql";
import PaginationControl from "components/admin/table/paginationControl";
import EditCell from "components/admin/table/editCell";
import useMemberTable, { MemberColumnInstance } from "utils/useMemberTable";

export { getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Label, Control, Select } = Form;

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
        disableSortBy: true,
      },
      {
        Header: "Action",
        accessor: () => "Member",
        id: "edit",
        Cell: EditCell,
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

  const tableInstance = useMemberTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    initialState: { filters: initialFilters, pageSize: 10, pageIndex: 0 },
  });

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
    rows,
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

  if (data && data !== membersData) {
    setMembersData(data);
  }

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
      console.log(csv);
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
      </>
    );
  }
  return <a href="/login">Please login first </a>;
};

Members.Layout = Layout;

export default Members;
