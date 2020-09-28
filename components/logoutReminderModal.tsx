import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Modal, Section, Button } from "react-bulma-components";

interface Props {
  open: boolean;
}

const LogoutReminderModal: React.FunctionComponent<Props> = ({
  open,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (open) router.prefetch(window.location.pathname);
  }, [open, router]);

  const refresh = () => {
    router.reload();
  };

  return (
    <Modal show={open} closeOnEsc={false} showClose={false} onClose={refresh}>
      <Modal.Content className="has-background-white box">
        <Section>You are about to logout, are you still here?</Section>
        <Button color="primary" onClick={refresh} className="is-pulled-right">
          I am still here!
        </Button>
      </Modal.Content>
    </Modal>
  );
};

export default LogoutReminderModal;
