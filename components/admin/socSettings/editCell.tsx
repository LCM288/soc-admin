import React, { useState } from "react";
import { CellProps } from "react-table";
import { Form, Button } from "react-bulma-components";

import { useMutation } from "@apollo/react-hooks";
import ConfirmApproveModal from "components/admin/registrations/confirmApproveModal";
import toast from "utils/toast";
import updateSocSettingMutation from "apollo/queries/socSetting/updateSocSetting.gql";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";

const { Input, Field, Control, Label } = Form;

const EditCell = ({
  row,
  value,
}: CellProps<Record<string, unknown>, string>): React.ReactElement => {
  const [updateSocSetting] = useMutation(updateSocSettingMutation, {
    refetchQueries: [{ query: socSettingsQuery }],
  });
  const [keyValue, setKeyValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const resetValue = () => {
    setKeyValue(value);
  };
  const updateValue = () => {
    setIsSaving(true);
    updateSocSetting({ variables: { key: row.values.key, value: keyValue } })
      .then((payload) => {
        if (!payload.data?.approveMembership.success) {
          throw new Error(
            payload.data?.approveMembership.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.approveMembership.message, {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .catch((err) => {
        toast.danger(err.message, { position: toast.POSITION.TOP_LEFT });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  return (
    <>
      <Field className="has-addons">
        <Control className="is-expanded">
          <Input
            placeholder="No values set..."
            value={keyValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
              setKeyValue(event.target.value)
            }
          />
        </Control>
        <Control>
          <Button
            color="danger"
            onClick={resetValue}
            disabled={value === keyValue}
          >
            Reset
          </Button>
        </Control>
        <Control>
          <Button
            color="success"
            onClick={updateValue}
            loading={isSaving}
            disabled={value === keyValue}
          >
            Update
          </Button>
        </Control>
      </Field>
    </>
  );
};

export default EditCell;
