import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Modal, Section, Button } from "react-bulma-components";

interface Props {
  open: boolean;
  onClose: () => void;
}

const LogoutReminderModal = ({ open, onClose }: Props): React.ReactElement => {
  const router = useRouter();

  useEffect(() => {
    if (open) router.prefetch(window.location.pathname);
  }, [open, router]);

  const refresh = useCallback(() => {
    router.reload();
  }, [router]);

  return (
    <Modal show={open} closeOnEsc={false} showClose={false} onClose={refresh}>
      <Modal.Content
        className="has-background-white box"
        style={{ position: "fixed", zIndex: 50 }}
      >
        <Section>You are about to logout, are you still here?</Section>
        <div className="is-pulled-right buttons">
          <Button color="primary" onClick={refresh}>
            Refresh
          </Button>
          <Button color="danger" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default LogoutReminderModal;
