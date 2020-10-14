import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Heading, Modal, Button, Form } from "react-bulma-components";
import { useMutation } from "@apollo/react-hooks";
import newExecutiveMutation from "apollo/queries/executive/newExecutive.gql";
import executivesQuery from "apollo/queries/executive/executives.gql";
import toast from "utils/toast";

const { Input, Field, Label, Control } = Form;

interface Props {
  open: boolean;
  onClose: () => void;
}

const AdminInputModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
}: Props) => {
  const [newExecutive] = useMutation(newExecutiveMutation, {
    refetchQueries: [{ query: executivesQuery }],
  });

  const router = useRouter();
  const [sid, setSID] = useState("");
  const [nickname, setNickname] = useState("");
  const [pos, setPos] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) router.prefetch(window.location.pathname);
  }, [open, router]);

  const formSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    newExecutive({ variables: { sid, nickname, pos } })
      .then((payload) => {
        if (!payload.data?.newExecutive.success) {
          throw new Error(
            payload.data?.newExecutive.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.newExecutive.message, {
          position: toast.POSITION.TOP_LEFT,
        });
        onClose();
      })
      .catch((err) => {
        toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal show={open} closeOnEsc={false} onClose={onClose}>
      <Modal.Content className="has-background-white box">
        <Heading>New Admin</Heading>
        <form onSubmit={(e) => formSubmit(e)}>
          <Field>
            <Label>SID</Label>
            <Control>
              <Input
                placeholder="SID"
                value={sid}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSID(e.target.value)
                }
              />
            </Control>
          </Field>
          <Field>
            <Label>Nickname</Label>
            <Control>
              <Input
                placeholder="Nickname"
                value={nickname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNickname(e.target.value)
                }
              />
            </Control>
          </Field>
          <Field>
            <Label>Position</Label>
            <Control>
              <Input
                placeholder="Position"
                value={pos}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPos(e.target.value)
                }
              />
            </Control>
          </Field>
          <div className="is-pulled-right buttons pt-4">
            <Button color="primary" type="submit" loading={loading}>
              Add
            </Button>
            <Button color="danger" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AdminInputModal;
