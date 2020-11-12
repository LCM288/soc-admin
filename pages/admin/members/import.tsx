import React, { useMemo, useState, useCallback, useEffect } from "react";
import useResizeAware from "react-resize-aware";
import { Row, CellProps } from "react-table";
import {
  statusOf,
  PersonModelAttributes,
  GenderEnum,
  CollegeEnum,
} from "@/utils/Person";
import useAsyncDebounce from "utils/useAsyncDebounce";
import PaginationControl from "components/admin/table/paginationControl";
import Papa from "papaparse";
import _ from "lodash";
import { DateTime } from "luxon";
import { useMutation } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import toast from "utils/toast";
import { ServerSideProps } from "utils/getServerSideProps";
import { Level, Table, Button, Form } from "react-bulma-components";
import importPeopleMutation from "apollo/queries/person/importPeople.gql";
import useMemberTable, { MemberColumnInstance } from "utils/useMemberTable";
import { PersonUpdateAttributes } from "@/models/Person";
import ImportEditCell from "components/admin/table/importEditCell";
import TableRow from "components/admin/table/tableRow";
import Loading from "components/loading";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const { InputFile, Input, Field, Label, Control, Select } = Form;

const Import = ({ user }: ServerSideProps): React.ReactElement => {
  // constant
  const statusOptions = useMemo(() => ["All", "Activated", "Expired"], []);
  const pageSizeOptions = useMemo(() => [1, 2, 5, 10, 20, 50], []);
  const getSortDirectionIndicatior = useCallback(
    (column: MemberColumnInstance) => {
      if (column.isSorted) {
        if (column.isSortedDesc) {
          return " 🔽";
        }
        return " 🔼";
      }
      return "";
    },
    []
  );

  // data
  const [importPeople] = useMutation(importPeopleMutation);

  const [membersData, setMembersData] = useState<
    { members: Record<string, unknown>[] } | undefined
  >(undefined);

  const updateMemberData = useCallback(
    (rowIndex: number, updatedPerson: PersonUpdateAttributes) => {
      const updatedMembers = membersData?.members ?? [];
      updatedMembers[rowIndex] = {
        ...updatedMembers[rowIndex],
        ...updatedPerson,
      };
      setMembersData({ members: updatedMembers });
    },
    [membersData]
  );

  // table
  const statusFilter = useCallback(
    (
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
        Header: "Expected Graduation",
        accessor: "expectedGraduationDate",
      },
      {
        Header: "Member Since",
        accessor: "memberSince",
      },
      {
        Header: "Member Until",
        accessor: "memberUntil",
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
        Cell: (cellProps: CellProps<Record<string, unknown>, string>) => (
          <ImportEditCell {...cellProps} updateMemberData={updateMemberData} />
        ),
        disableSortBy: true,
      },
    ],
    [statusFilter, updateMemberData]
  );

  const tableData = useMemo(() => {
    return (
      membersData?.members?.map((member, index) => ({
        ...member,
        id: index + 1,
      })) ?? []
    );
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { globalFilter, filters, pageIndex, pageSize },
    setGlobalFilter,
    setFilter,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    page,
    pageCount,
    setPageSize,
    gotoPage,
  } = useMemberTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
    autoResetFilters: false,
    autoResetGlobalFilter: false,
    initialState: { filters: initialFilters, pageSize: 10, pageIndex: 0 },
    autoResetPage: false,
  });

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

  // import & upload
  const [isUploading, setIsUploading] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);

  const upload = useCallback(() => {
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
    const importPeoplePromises = _.chunk(members, 100).map(
      (people, batch) =>
        new Promise<string[]>((resolve) =>
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
                      `Error on ${
                        members[batch * 100 + count].sid
                      }: ${message}`,
                      {
                        position: toast.POSITION.TOP_LEFT,
                      }
                    );
                  }
                }
              );
              resolve(
                data.importPeople
                  .filter(({ success }: { success: boolean }) => success)
                  .map(
                    ({ person }: { person: PersonModelAttributes }) =>
                      person.sid
                  )
              );
            })
            .catch((err) => {
              toast.danger(err.message, {
                position: toast.POSITION.TOP_LEFT,
              });
              resolve([]);
            })
            .finally(() => setIsUploading(false))
        )
    );
    Promise.all(importPeoplePromises).then((importPeopleSuccessSIDBatches) => {
      const importPeopleSuccessSIDFlat = importPeopleSuccessSIDBatches.flat();
      const importedCount = importPeopleSuccessSIDFlat.length;
      const failedUploadSID = _.difference(
        membersData.members.map((member) => member.sid as string),
        importPeopleSuccessSIDFlat
      );
      setMembersData({
        members: membersData.members.filter((member) =>
          failedUploadSID.includes(member.sid as string)
        ),
      });
      if (importedCount) {
        toast.success(
          `${importedCount} member${importedCount !== 1 ? "s" : ""} imported.`,
          {
            position: toast.POSITION.TOP_LEFT,
          }
        );
      } else {
        toast.danger("No members were imported", {
          position: toast.POSITION.TOP_LEFT,
        });
      }
    });
  }, [importPeople, membersData]);

  const onImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsFileProcessing(true);
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          const { year, month } = DateTime.local();
          const prevEntry = month >= 9 ? `${year}-09-01` : `${year - 1}-09-01`;
          const prevEntryGrad =
            month >= 9 ? `${year + 4}-08-01` : `${year + 3}-08-01`;
          const result = {
            members: results.data.map(
              ({
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
                sid,
                chineseName,
                englishName: englishName ?? "",
                gender: Object.values(GenderEnum).includes(gender)
                  ? gender
                  : GenderEnum.None,
                dateOfBirth: dateRegex.test(dateOfBirth) ? dateOfBirth : null,
                email,
                phone,
                college: Object.values(CollegeEnum).includes(college)
                  ? college
                  : CollegeEnum.None,
                major,
                dateOfEntry: dateRegex.test(dateOfEntry)
                  ? dateOfEntry
                  : prevEntry,
                expectedGraduationDate: dateRegex.test(expectedGraduationDate)
                  ? expectedGraduationDate
                  : prevEntryGrad,
                memberSince: dateRegex.test(memberSince) ? memberSince : null,
              })
            ),
          };
          setMembersData(result);
          setIsFileProcessing(false);
        },
      });
    } else {
      toast.danger("No files were selected.", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, []);

  // resize
  const [resizeListener, sizes] = useResizeAware();

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
        "memberSince",
        "memberUntil",
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
        "memberSince",
        "memberUntil",
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

  if (user) {
    return (
      <>
        {resizeListener}
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
        <Loading loading={isFileProcessing} />
      </>
    );
  }
  return <></>;
};

Import.Layout = AdminLayout;

export default Import;
