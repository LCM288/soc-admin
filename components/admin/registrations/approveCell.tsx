import React, { useState } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import ApproveModal from "components/admin/registrations/approveModal";
import toast from "utils/toast";
import approveMembershipMutation from "apollo/queries/person/approveMembership.gql";
import registrationsQuery from "apollo/queries/person/registrations.gql";

interface Props extends CellProps<Record<string, unknown>, string> {
  setCanExpand: (newValue: boolean) => void;
}

const ApproveCell = ({ row, setCanExpand }: Props): React.ReactElement => {
  const [approveMembership] = useMutation(approveMembershipMutation, {
    refetchQueries: [{ query: registrationsQuery }],
  });
  const [approveLoading, setApproveLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const approve = (memberUntil: string | undefined) => {
    setApproveLoading(true);
    approveMembership({
      variables: { sid: row.values.sid as string, memberUntil },
    })
      .then((payload) => {
        if (!payload.data?.approveMembership.success) {
          throw new Error(
            payload.data?.approveMembership.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.approveMembership.message, {
          position: toast.POSITION.TOP_LEFT,
        });
        setOpenModal(false);
        setCanExpand(true);
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
    setCanExpand(false);
  };
  const cancelApprove = () => {
    setOpenModal(false);
    setCanExpand(true);
  };
  return (
    <>
      {openModal && (
        <ApproveModal
          sid={row.values.sid as string}
          englishName={row.values.englishName as string}
          onConfirm={approve}
          onCancel={cancelApprove}
        />
      )}
      <Button color="success" onClick={promptApprove} loading={approveLoading}>
        Approve
      </Button>
    </>
  );
};

export default ApproveCell;
