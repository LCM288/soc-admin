/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useMemo } from "react";
import { useTable, CellProps } from "react-table";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";
import { College } from "@/models/College";
import { Major } from "@/models/Major";
import { Table, Button } from "react-bulma-components";
import ConfirmApproveModal from "components/admin/registrations/confirmApproveModal";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import approveMembershipMutation from "apollo/queries/person/approveMembership.gql";
import toast from "utils/toast";

export { getServerSideProps } from "utils/getServerSideProps";

const Registrations = ({ user }: ServerSideProps): React.ReactElement => {
  const { data, loading, error } = useQuery(registrationsQuery, {
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });
  const [approveMembership] = useMutation(approveMembershipMutation);
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
        Cell: ({ value }: CellProps<Record<string, unknown>, College>) => {
          return <div>{`${value.code}`}</div>;
        },
      },
      {
        Header: "Major",
        accessor: "major",
        Cell: ({ value }: CellProps<Record<string, unknown>, Major>) => {
          return <div>{`${value.code}`}</div>;
        },
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
        Header: "Approve",
        accessor: (row: Record<string, unknown>) => row.sid,
        id: "approve",
        Cell: ({
          row,
          value: sid,
        }: CellProps<Record<string, unknown>, number>) => {
          const [approveLoading, setApproveLoading] = useState(false);
          const [openModal, setOpenModal] = useState(false);
          const approve = () => {
            setOpenModal(false);
            approveMembership({ variables: { sid } })
              .then((payload) => {
                if (!payload.data?.approveMembership.success) {
                  throw new Error(
                    payload.data?.approveMembership.message ??
                      "some error occurs"
                  );
                }
                toast.success(payload.data.approveMembership.message, {
                  position: toast.POSITION.TOP_LEFT,
                });
              })
              .catch((err) => {
                toast.danger(err, { position: toast.POSITION.TOP_LEFT });
              })
              .finally(() => {
                setApproveLoading(false);
              });
            setApproveLoading(true);
          };
          const promptApprove = () => {
            setOpenModal(true);
          };
          const cencelApprove = () => {
            setOpenModal(false);
          };
          return (
            <>
              {openModal && (
                <ConfirmApproveModal
                  onConfirm={approve}
                  onCancel={cencelApprove}
                  row={row.values}
                />
              )}
              <Button
                color="success"
                onClick={promptApprove}
                loading={approveLoading}
              >
                Approve {row.values.englishName}
              </Button>
            </>
          );
        },
      },
    ],
    [approveMembership]
  );
  const tableData = useMemo(() => {
    return data?.registrations ?? [];
  }, [data]);
  const tableGetRowId = useMemo(() => {
    return (row: Record<string, unknown>) => (row.id as number).toString();
  }, []);
  const tableInstance = useTable({
    columns: tableColumns,
    data: tableData,
    getRowId: tableGetRowId,
  });

  if (loading) return <p>loading</p>;
  if (error) return <p>ERROR</p>;
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

Registrations.Layout = Layout;

export default Registrations;
