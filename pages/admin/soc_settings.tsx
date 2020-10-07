/* eslint-disable react/jsx-props-no-spreading */

import React, { useMemo, useState } from "react";
import { useTable, CellProps } from "react-table";
import { useQuery } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { Table } from "react-bulma-components";
import EditCell from "components/admin/socSettings/editCell";

import toast from "utils/toast";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";
import allSocSettings from "utils/socSettings";

export { getServerSideProps } from "utils/getServerSideProps";

const mergeByKey = (
  a1: Record<string, string>[],
  a2: Record<string, string>[]
) =>
  a1.map((itm) => ({
    ...a2.find((item) => item.key && itm.key && item.key === itm.key),
    ...itm,
  }));

const SocSettings = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(socSettingsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const [socSettingsData, setSocSettingsData] = useState<
    { socSettings: Record<string, string>[] } | undefined
  >(undefined);

  const tableColumns = useMemo(
    () => [
      {
        Header: "Key",
        accessor: "key",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: EditCell,
      },
    ],
    []
  );

  const tableData = useMemo(() => {
    return (
      (socSettingsData &&
        mergeByKey(
          Object.values(allSocSettings),
          socSettingsData.socSettings
        )) ||
      []
    );
  }, [socSettingsData]);

  /* const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => (row.id as number).toString();
  }, []); */

  const tableInstance = useTable({
    columns: tableColumns,
    data: tableData,
    initialState: {
      hiddenColumns: ["type"],
    },
  });

  if (data && data !== socSettingsData) {
    setSocSettingsData(data);
  }

  if (!socSettingsData) {
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
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
    );
  }
  return <a href="/login">Please login first </a>;
};

SocSettings.Layout = Layout;

export default SocSettings;
