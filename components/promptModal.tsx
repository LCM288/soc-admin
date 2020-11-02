import React from "react";
import { Modal, Button, Heading } from "react-bulma-components";

interface Props {
  message: string | React.ReactElement;
  onConfirm: () => void;
  onCancel: () => void;
}

const PromptModal: React.FunctionComponent<Props> = ({
  message,
  onConfirm,
  onCancel,
}: Props) => (
  <Modal show closeOnEsc onClose={onCancel}>
    <Modal.Content className="has-background-white box">
      {(typeof message === "string" && (
        <Heading className="has-text-centered" size={4}>
          {message}
        </Heading>
      )) ||
        message}
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

export default PromptModal;
