import dynamic from "next/dynamic";
import React, {
  useState,
  useRef,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import { CellProps } from "react-table";
import { Form, Button, Content, Tile } from "react-bulma-components";
import ReactMarkdown from "react-markdown/with-html";
import { useMutation } from "@apollo/react-hooks";
import toast from "utils/toast";
import updateSocSettingMutation from "apollo/queries/socSetting/updateSocSetting.gql";
import socSettingsQuery from "apollo/queries/socSetting/socSettings.gql";
import socNameQuery from "apollo/queries/socSetting/socName.gql";
import { SimpleMDEEditorProps } from "react-simplemde-editor";

const SimpleMDE = dynamic<SimpleMDEEditorProps>(
  () => import("react-simplemde-editor")
);

const { Input, Field, Control } = Form;

interface Props extends CellProps<Record<string, unknown>, string> {
  windowWidth: number;
}

const EditCell = ({ row, value, windowWidth }: Props): React.ReactElement => {
  const [updateSocSetting] = useMutation(updateSocSettingMutation, {
    refetchQueries: [{ query: socSettingsQuery }, { query: socNameQuery }],
  });

  const oldValue = useRef<string | undefined>();
  const [editingValue, setEditingValue] = useState(value);
  // https://github.com/RIP21/react-simplemde-editor/issues/79
  const [refreshState, dispatchForceRefresh] = useReducer(
    (state) => state + 1,
    0
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingValue === oldValue.current && editingValue !== value) {
      setEditingValue(value);
    }
    oldValue.current = value;
  }, [editingValue, value]);

  const resetValue = useCallback(() => {
    dispatchForceRefresh();
    setEditingValue(value);
  }, [value]);

  const updateValue = useCallback(() => {
    setIsSaving(true);
    updateSocSetting({
      variables: { key: row.values.key, value: editingValue },
    })
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
  }, [updateSocSetting, row.values.key, editingValue]);

  const ResetButton = useCallback(
    () => (
      <Button color="danger" outlined onClick={resetValue}>
        Reset
      </Button>
    ),
    [resetValue]
  );

  const UpdateButton = useCallback(
    () => (
      <Button
        color="success"
        onClick={updateValue}
        loading={isSaving}
        disabled={value === editingValue}
      >
        Update
      </Button>
    ),
    [updateValue, isSaving, value, editingValue]
  );

  switch (row.values.type) {
    case "string":
      return (
        <>
          <Field className="has-addons">
            <Control className="is-expanded">
              <Input
                placeholder="No values set..."
                value={editingValue}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
                  setEditingValue(event.target.value)
                }
              />
            </Control>
            {windowWidth > 768 && (
              <>
                <Control>
                  <ResetButton />
                </Control>
                <Control>
                  <UpdateButton />
                </Control>
              </>
            )}
          </Field>
          {windowWidth <= 768 && (
            <div className="buttons">
              <ResetButton />
              <UpdateButton />
            </div>
          )}
        </>
      );
    case "richtext":
    default:
      return (
        <>
          <Tile
            kind="ancestor"
            className="mb-1"
            style={{ maxWidth: "calc(100% - 1.5rem)" }}
          >
            <Tile kind="parent">
              <Tile kind="child">
                <SimpleMDE
                  id={row.values.key}
                  key={refreshState}
                  value={editingValue}
                  onChange={setEditingValue}
                  options={{
                    minHeight: "10rem",
                    maxHeight: "20rem",
                    previewClass: ["editor-preview", "content"],
                    toolbar: [
                      "bold",
                      "italic",
                      "strikethrough",
                      "|",
                      "heading-smaller",
                      "heading-bigger",
                      "|",
                      "code",
                      "quote",
                      "unordered-list",
                      "ordered-list",
                      "|",
                      "link",
                      "image",
                      "table",
                      "horizontal-rule",
                      "|",
                      "guide",
                    ],
                  }}
                />
              </Tile>
            </Tile>
            <Tile kind="parent" vertical>
              <Tile kind="child" className="box preview-content">
                <Content>
                  <ReactMarkdown source={editingValue} escapeHtml={false} />
                </Content>
              </Tile>
            </Tile>
          </Tile>
          <Button.Group position="right">
            <Button color="danger" outlined onClick={resetValue}>
              Reset
            </Button>
            <Button
              color="success"
              onClick={updateValue}
              loading={isSaving}
              disabled={value === editingValue}
            >
              Update
            </Button>
          </Button.Group>
        </>
      );
  }
};

export default EditCell;
