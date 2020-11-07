import React, { useState, useCallback } from "react";
import { CellProps } from "react-table";
import { Button } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import ApproveModal from "components/admin/registrations/approveModal";
import toast from "utils/toast";
import approveMembershipMutation from "apollo/queries/person/approveMembership.gql";
import registrationsQuery from "apollo/queries/person/registrations.gql";
import { StopClickDiv } from "utils/domEventHelpers";
import useClipped from "utils/useClipped";

type Props = CellProps<Record<string, unknown>, string>;

const ApproveCell = ({ row }: Props): React.ReactElement => {
  const [approveMembership] = useMutation(approveMembershipMutation, {
    refetchQueries: [{ query: registrationsQuery }],
  });
  const [approveLoading, setApproveLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useClipped(openModal);
  const approve = useCallback(
    (memberUntil: string | null) => {
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
        })
        .catch((err) => {
          toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
        })
        .finally(() => {
          setApproveLoading(false);
        });
    },
    [approveMembership, row.values.sid]
  );
  const promptApprove = useCallback(() => {
    setOpenModal(true);
  }, []);
  const cancelApprove = useCallback(() => {
    setOpenModal(false);
  }, []);
  return (
    <StopClickDiv>
      <>
        {openModal && (
          <ApproveModal
            sid={row.values.sid as string}
            englishName={row.values.englishName as string}
            onConfirm={approve}
            onCancel={cancelApprove}
          />
        )}
        <Button
          color="success"
          onClick={promptApprove}
          loading={approveLoading}
        >
          Approve
        </Button>
      </>
    </StopClickDiv>
  );
};

export default ApproveCell;
