import React from "react";
import { Modal, Button, Section } from "react-bulma-components";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  row: Record<string, unknown>;
}

const ConfirmApproveModal: React.FunctionComponent<Props> = ({
  onConfirm,
  onCancel,
  row,
}: Props) => {
  const message = `Are you sure you want to approve the membership of ${row.englishName}?`;
  return (
    <Modal show closeOnEsc={false} showClose={false} onClose={onCancel}>
      <Modal.Content className="has-background-white box">
        <Section>{message}</Section>
        <div className="is-pulled-right buttons">
          <Button color="primary" onClick={onConfirm}>
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

export default ConfirmApproveModal;
