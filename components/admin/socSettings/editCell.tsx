import dynamic from "next/dynamic";
import React, { useState } from "react";
import { CellProps } from "react-table";
import { Form, Button, Content, Tile } from "react-bulma-components";
import ReactMarkdown from "react-markdown/with-html";
import { useMutation } from "@apollo/react-hooks";
import toast from "utils/toast";
import updateSocSettingMutation from "apollo/queries/socSetting/updateSocSetting.gql";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";

const SimpleMDE = dynamic<any>(() => import("react-simplemde-editor"));

const { Input, Field, Control } = Form;

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
        if (!payload.data?.updateSocSetting.success) {
          throw new Error(
            payload.data?.updateSocSetting.message ?? "some error occurs"
          );
        }
        toast.success(payload.data.updateSocSetting.message, {
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
  switch (row.values.type) {
    case "string":
      return (
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
              outlined
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
      );
    case "richtext":
    default:
      return (
        <>
          <Tile kind="ancestor">
            <Tile>
              <Tile kind="parent">
                <Tile kind="child">
                  <SimpleMDE
                    id={row.values.key}
                    value={keyValue}
                    onChange={(newValue: string) => setKeyValue(newValue)}
                    options={{
                      minHeight: "10rem",
                      maxHeight: "20rem",
                      previewClass: ["editor-preview", "content"],
                    }}
                  />
                </Tile>
              </Tile>
              <Tile kind="parent">
                <Tile kind="child" className="box preview-content">
                  <Content>
                    <ReactMarkdown source={keyValue} escapeHtml={false} />
                  </Content>
                </Tile>
              </Tile>
            </Tile>
          </Tile>
          <Button.Group position="right">
            <Button
              color="danger"
              outlined
              onClick={resetValue}
              disabled={value === keyValue}
            >
              Reset
            </Button>
            <Button
              color="success"
              onClick={updateValue}
              loading={isSaving}
              disabled={value === keyValue}
            >
              Update
            </Button>
          </Button.Group>
        </>
      );
  }
};

export default EditCell;
