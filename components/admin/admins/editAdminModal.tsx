import React, { useCallback, useState, useMemo } from "react";
import { Heading, Modal, Button } from "react-bulma-components";
import Loading from "components/loading";
import { ExecutiveUpdateAttributes } from "@/models/Executive";
import TextField from "components/register/textField";
import { PreventDefaultForm } from "utils/domEventHelpers";

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
        <PreventDefaultForm onSubmit={onConfirm}>
          <>
            <Heading className="has-text-centered">Edit Admin</Heading>
            <TextField
              value={sid}
              pattern="^\d{10}$"
              label="Student ID"
              placeholder="Student ID"
              required
            />
            <TextField
              value={nickname}
              setValue={setNickname}
              label="Nickname"
              placeholder="Nickname"
              editable
            />
            <TextField
              value={pos}
              setValue={setPos}
              label="Position"
              placeholder="Position"
              editable
            />
            <div className="is-pulled-right buttons pt-4">
              <Button type="button" onClick={onReset}>
                Reset
              </Button>
              <Button type="submit" color="primary">
                Confirm
              </Button>
              <Button color="danger" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </>
        </PreventDefaultForm>
      </Modal.Content>
      <Loading loading={loading} />
    </Modal>
  );
};

export default EditAdminModal;
