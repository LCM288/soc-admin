import React, { useMemo, useState, useEffect, useCallback } from "react";
import useResizeAware from "react-resize-aware";
import { Row, CellProps } from "react-table";
import useAsyncDebounce from "utils/useAsyncDebounce";
import { useQuery } from "@apollo/react-hooks";
import AdminLayout from "layouts/adminLayout";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Form, Level } from "react-bulma-components";
import toast from "utils/toast";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import ApproveCell from "components/admin/registrations/approveCell";
import EditCell from "components/admin/table/editCell";
import TableHead from "components/admin/table/tableHead";
import TableRow from "components/admin/table/tableRow";
import PaginationControl from "components/admin/table/paginationControl";
import useRegistrationTable, {
  RegistrationColumnInstance,
} from "utils/useRegistrationTable";
import AddRegistration from "components/admin/registrations/addRegistration";
import { cloneDeep, compact } from "lodash";
import Loading from "components/loading";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const { Input, Field, Label, Control, Select } = Form;

const Registrations = ({ user }: ServerSideProps): React.ReactElement => {
  // constant
  const typeOptions = useMemo(() => ["All", "New", "Renewal"], []);
  const pageSizeOptions = useMemo(() => [1, 2, 5, 10, 20, 50], []);
  const getSortDirectionIndicatior = useCallback(
    (column: RegistrationColumnInstance): string => {
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
  const { data, loading, error } = useQuery(registrationsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [registrationsData, setRegistrationsData] = useState<
    { registrations: Record<string, unknown>[] } | undefined
  >(undefined);

  useEffect(() => setRegistrationsData(data), [data]);
  useEffect(() => {
    if (error) {
      toast.danger(error.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }, [error]);

  // table
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
        width: 50,
        maxWidth: 50,
      },
      {
        Header: "SID",
        accessor: "sid",
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "Chinese Name",
        accessor: "chineseName",
        width: 140,
        maxWidth: 140,
      },
      {
        Header: "English Name",
        accessor: "englishName",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Gender",
        accessor: "gender",
        width: 70,
        maxWidth: 70,
      },
      {
        Header: "Date of Birth",
        accessor: "dateOfBirth",
        width: 130,
        maxWidth: 130,
      },
      {
        Header: "Email",
        accessor: "email",
        width: 300,
        maxWidth: 300,
      },
      {
        Header: "Phone",
        accessor: "phone",
        width: 145,
        maxWidth: 145,
      },
      {
        Header: "College",
        accessor: (row: Record<string, unknown>) =>
          (row.college as College).code,
        id: "college",
        width: 80,
        maxWidth: 80,
      },
      {
        Header: "Major",
        accessor: (row: Record<string, unknown>) => (row.major as Major).code,
        id: "major",
        width: 80,
        maxWidth: 80,
      },
      {
        Header: "Date of Entry",
        accessor: "dateOfEntry",
        width: 140,
        maxWidth: 140,
      },
      {
        Header: "Expected Graduation",
        accessor: "expectedGraduationDate",
        width: 190,
        maxWidth: 190,
      },
      {
        Header: "Type",
        accessor: "registrationType",
        filter: typeFilter,
        disableSortBy: true,
        width: 60,
        maxWidth: 60,
      },
      {
        Header: "Action",
        accessor: () => "Registration",
        id: "action",
        Cell: (cellPrpos: CellProps<Record<string, unknown>, string>) => (
          <div className="buttons">
            <ApproveCell {...cellPrpos} />
            <EditCell {...cellPrpos} />
          </div>
        ),
        disableSortBy: true,
        minWidth: 200,
        width: 200,
        maxWidth: 200,
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

  // resize
  const [resizeListener, sizes] = useResizeAware();

  const hideColumnOrder = useMemo(
    () => [
      ["gender", "dateOfBirth", "dateOfEntry", "expectedGraduationDate"],
      ["id", "email"],
      ["phone"],
      ["chineseName"],
      ["major", "college"],
      ["registrationType", "action"],
    ],
    []
  );

  useEffect(() => {
    let newHideColumn: string[] = [];
    let maxWidth = tableColumns
      .map((column) => column.maxWidth)
      .reduce((a, b) => a + b, 0);
    const columnsToHide = cloneDeep(hideColumnOrder);
    while (sizes.width < maxWidth && columnsToHide.length) {
      newHideColumn = newHideColumn.concat(columnsToHide[0]);
      maxWidth -= compact(
        columnsToHide[0].map((columnId) =>
          tableColumns.find(
            (column) => column.id === columnId || column.accessor === columnId
          )
        )
      )
        .map((column) => column.maxWidth)
        .reduce((a, b) => a + b, 0);
      columnsToHide.splice(0, 1);
    }
    setHiddenColumns(newHideColumn);
  }, [sizes.width, hideColumnOrder, tableColumns, setHiddenColumns]);

  if (user) {
    return (
      <>
        {resizeListener}
        <PaginationControl
          gotoPage={gotoPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
        />
        <Level className="is-mobile is-flex-wrap-wrap">
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
            <Field horizontal className="is-flex">
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
          <TableHead
            headerGroups={headerGroups}
            getSortDirectionIndicatior={getSortDirectionIndicatior}
          />
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
        <Level className="is-mobile">
          <div />
          <Level.Side align="right">
            <AddRegistration />
          </Level.Side>
        </Level>
        <Loading loading={loading} />
      </>
    );
  }
  return <></>;
};

Registrations.Layout = AdminLayout;

export default Registrations;
