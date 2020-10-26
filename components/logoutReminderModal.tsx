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

  const logout = () => {
    router.push("/api/logout");
  };

  return (
    <Modal
      show={open}
      closeOnEsc={false}
      showClose={false}
      onClose={refresh}
      style={{ zIndex: 50 }}
    >
      <Modal.Content className="has-background-white box">
        <Section>You are about to logout, are you still here?</Section>
        <div className="is-pulled-right buttons">
          <Button color="primary" onClick={refresh}>
            I am still here!
          </Button>
          <Button color="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default LogoutReminderModal;
