/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import { useTable, useRowState } from "react-table";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { Button, Table } from "react-bulma-components";
import toast from "utils/toast";
import executivesQuery from "apollo/queries/executive/executives.gql";
import EditableCell from "components/admin/admin/editableCell";
import ActionsCell from "components/admin/admin/actionsCell";
import AdminInputModal from "components/admin/admin/adminInputModal";

export { getServerSideProps } from "utils/getServerSideProps";

const Members = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(executivesQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [executivesData, setExecutivesData] = useState<
    { executives: Record<string, unknown>[] } | undefined
  >(undefined);

  const tableColumns = useMemo(
    () => [
      {
        Header: "SID",
        accessor: "sid",
        Cell: EditableCell,
      },
      {
        Header: "Nickname",
        accessor: "nickname",
        Cell: EditableCell,
      },
      {
        Header: "Position",
        accessor: "pos",
        Cell: EditableCell,
      },
      {
        Header: "",
        id: "edit",
        Cell: ActionsCell,
      },
    ],
    []
  );

  const tableData = useMemo(() => {
    return executivesData?.executives ?? [];
  }, [executivesData]);

  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => row.sid as string;
  }, []);

  const tableInstance = useTable(
    {
      columns: tableColumns,
      data: tableData,
      getRowId: tableGetRowId,
      // @ts-expect-error react-table types not updated
      initialRowStateAccessor: (row: any) => ({ row, edit: false }),
    },
    useRowState
  );

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

  const onModalOpen = () => {
    setModalOpen(true);
  };

  if (user) {
    return (
      <div>
        <AdminInputModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
        />
        <Button color="primary" onClick={onModalOpen}>
          Add person
        </Button>
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
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
};

Members.Layout = Layout;

export default Members;
