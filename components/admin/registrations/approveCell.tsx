import React, { useState } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import ConfirmApproveModal from "components/admin/registrations/confirmApproveModal";
import toast from "utils/toast";
import approveMembershipMutation from "apollo/queries/person/approveMembership.gql";
import registrationsQuery from "apollo/queries/person/registrations.gql";

const ApproveCell = ({
  row,
}: CellProps<Record<string, unknown>, boolean>): React.ReactElement => {
  const [approveMembership] = useMutation(approveMembershipMutation, {
    refetchQueries: [{ query: registrationsQuery }],
  });
  const [approveLoading, setApproveLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const approve = () => {
    setOpenModal(false);
    setApproveLoading(true);
    approveMembership({ variables: { sid: row.values.sid as string } })
      .then((payload) => {
        if (!payload.data?.approveMembership.success) {
          throw new Error(
            payload.data?.approveMembership.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.approveMembership.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .catch((err) => {
        toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
      })
      .finally(() => {
        setApproveLoading(false);
      });
  };
  const promptApprove = () => {
    setOpenModal(true);
  };
  const cancelApprove = () => {
    setOpenModal(false);
  };
  return (
    <>
      {openModal && (
        <ConfirmApproveModal
          onConfirm={approve}
          onCancel={cancelApprove}
          row={row.values}
        />
      )}
      <Button color="success" onClick={promptApprove} loading={approveLoading}>
        Approve
      </Button>
    </>
  );
};

export default ApproveCell;
