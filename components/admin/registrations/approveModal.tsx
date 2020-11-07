import React, { useState } from "react";
import { Modal, Button, Heading } from "react-bulma-components";
import MemberUntilField from "components/register/memberUntilField";

interface Props {
  sid: string;
  englishName: string;
  onConfirm: (memberUntil: string | null) => void;
  onCancel: () => void;
}

const ApproveModal = ({
  sid,
  englishName,
  onConfirm,
  onCancel,
}: Props): React.ReactElement => {
  const [memberUntil, setMemberUntil] = useState<string | null>(null);

  return (
    <Modal show closeOnEsc onClose={onCancel} className="modal-ovrflowing">
      <Modal.Content className="has-background-white box">
        <Heading className="has-text-centered" size={5}>
          {`You are going to approve ${englishName}'s (sid: ${sid}) membership.`}
        </Heading>
        <MemberUntilField
          label="Membership Expiration Date"
          nullLabel="Until Grad"
          dateValue={memberUntil}
          setDateValue={setMemberUntil}
          editable
        />
        <div className="is-pulled-right buttons pt-4">
          <Button type="button" color="primary" onClick={onConfirm}>
            Confirm
          </Button>
          <Button color="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default ApproveModal;
