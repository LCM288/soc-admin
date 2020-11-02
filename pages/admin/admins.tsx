/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import useAdminTable, { AdminColumnInstance } from "utils/useAdminTable";
import { CellProps } from "react-table";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { Table } from "react-bulma-components";
import toast from "utils/toast";
import executivesQuery from "apollo/queries/executive/executives.gql";
import ActionsCell from "components/admin/admins/actionsCell";
import AddAdmin from "components/admin/admins/addAdmin";

export { getServerSideProps } from "utils/getServerSideProps";

const getSortDirectionIndicatior = (column: AdminColumnInstance): string => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return " 🔽";
    }
    return " 🔼";
  }
  return "";
};

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(executivesQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [executivesData, setExecutivesData] = useState<
    { executives: Record<string, unknown>[] } | undefined
  >(undefined);

  const tableColumns = useMemo(
    () => [
      {
        Header: "SID",
        accessor: "sid",
      },
      {
        Header: "Nickname",
        accessor: "nickname",
      },
      {
        Header: "Position",
        accessor: "pos",
      },
      {
        Header: "Actions",
        id: "edit",
        Cell: (props: CellProps<Record<string, unknown>, string>) => (
          <ActionsCell {...props} user={user} />
        ),
        disableSortBy: true,
      },
    ],
    [user]
  );

  const tableData = useMemo(() => {
    return executivesData?.executives ?? [];
  }, [executivesData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => row.sid as string;
  }, []);

  const tableInstance = useAdminTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
  });

  if (data && data !== executivesData) {
    setExecutivesData(data);
  }

  if (!executivesData) {
    if (loading) return <p>loading</p>;
    if (error) return <p>{error.message}</p>;
  } else if (error) {
    toast.danger(error.message, {
      position: toast.POSITION.TOP_LEFT,
    });
  }

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
        <AddAdmin />
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
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
};

Members.Layout = Layout;

export default Members;
