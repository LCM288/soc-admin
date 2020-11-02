import React, { useCallback, useState, useMemo } from "react";
import { Heading, Modal, Button, Form } from "react-bulma-components";
import Loading from "components/loading";
import { ExecutiveUpdateAttributes } from "@/models/Executive";

const { Input, Field, Label, Control } = Form;

interface Props {
  onSave: (person: ExecutiveUpdateAttributes) => void;
  onCancel: () => void;
  row: Record<string, unknown>;
  loading: boolean;
}

const EditAdminModal: React.FunctionComponent<Props> = ({
  onSave,
  onCancel,
  row,
  loading,
}: Props) => {
  const sid = useMemo(() => row.sid as string, [row.sid]);
  const [nickname, setNickname] = useState((row.nickname ?? "") as string);
  const [pos, setPos] = useState((row.pos ?? "") as string);

  const onReset = useCallback(() => {
    setNickname((row.nickname ?? "") as string);
    setPos((row.pos ?? "") as string);
  }, [row]);

  const onConfirm = useCallback(() => {
    onSave({ sid, nickname, pos });
  }, [onSave, sid, nickname, pos]);

  return (
    <Modal show closeOnEsc={false} onClose={onCancel}>
      <Modal.Content className="has-background-white box">
        <Heading>Edit Admin</Heading>
        <Field>
          <Label>SID</Label>
          <Control>
            <Input type="number" value={sid} disabled />
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
          <Button type="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="button" color="primary" onClick={onConfirm}>
            Confirm
          </Button>
          <Button color="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Modal.Content>
      <Loading loading={loading} />
    </Modal>
  );
};

export default EditAdminModal;
